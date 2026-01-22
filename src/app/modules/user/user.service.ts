import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { User } from './user.model'
import { USER_ROLES, USER_STATUS } from '../../../enum/user'
import { JwtPayload } from 'jsonwebtoken'
import { logger } from '../../../shared/logger'
import { AuthHelper } from '../auth/auth.helper'
import QueryBuilder from '../../builder/QueryBuilder'
import config from '../../../config'
import { searchLocationsByQuery } from '../../../utils/googleMapsAddress.util'
import { PropertyServices } from '../property/property.service'
import { startSession } from 'mongoose'
import { IBusinessDetails, IUser } from './user.interface'


// create super admin
const createAdmin = async (): Promise<Partial<IUser> | null> => {
  const admin = {
    email: config.super_admin.email,
    firstName: config.super_admin.name,
    lastName: config.super_admin.name,
    password: config.super_admin.password,
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    verified: true,
    authentication: {
      oneTimeCode: '',
      restrictionLeftAt: null,
      resetPassword: false,
      wrongLoginAttempts: 0,
      latestRequestAt: new Date(),
    },
  }

  const isAdminExist = await User.findOne({
    email: admin.email,
    status: { $nin: [USER_STATUS.DELETED] },
  })

  if (isAdminExist) {
    logger.log('info', 'Admin account already exist, skipping creation.')
    return isAdminExist
  }
  const result = await User.create([admin])
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create admin')
  }
  logger.log('info', 'Admin account created successfully.')
  return result[0]
}

const getAllUser = async (query: Record<string, unknown>) => {
  const userQueryBuilder = new QueryBuilder(User.find().select('-password -authentication'), query)
    .filter()
    .sort()
    .fields()
    .paginate()




  const users = await userQueryBuilder.modelQuery.lean()
  const paginationInfo = await userQueryBuilder.getPaginationInfo()

  const totalUsers = await User.countDocuments()

  const totalBusiness = await User.countDocuments({
    role: USER_ROLES.BUSINESS,
  })

  const staticData = { totalUsers, totalBusiness }

  return {
    users,
    staticData,
    meta: paginationInfo,
  }
}

const getSingleUser = async (id: string) => {
  const result = await User.findById(id).select('-password -authentication')
  return result
}

const deleteUser = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (user.role === USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Admin cannot be deleted')
  }
  const result = await User.findByIdAndDelete(id)
  return result
}

const updateProfile = async (
  user: JwtPayload,
  payload: Partial<IUser>
) => {
  const isExistUser = await User.findById(user.authId)

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found or deleted.')
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user.authId, status: { $ne: USER_STATUS.DELETED } },
    payload,
    { new: true },
  )

  if (!updatedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile')
  }

  return updatedUser
}

const getProfile = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.authId).lean().select('-password -authentication')
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The requested profile not found or deleted.',
    )
  }
  return isExistUser
}




const deleteMyAccount = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'The requested profile not found or deleted.',
    )
  }

  await User.findByIdAndDelete(isExistUser._id)
  return 'Account deleted successfully'
}

// complete profile
export const completeProfile = async (
  user: JwtPayload,
  payload: Partial<IBusinessDetails>,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  // Address logic
  let countryCode = "US"; // Default fallback
  if (payload.addressLine1 || payload.city) {
    const searchQuery = [
      payload.addressLine1,
      payload.addressLine2,
      payload.city,
      payload.postcode, // postcode in interface
      payload.country,
    ]
      .filter(Boolean)
      .join(', ')

    // Backend controlled countryCode resolution
    try {
      const result = await searchLocationsByQuery(searchQuery);
      if (result && result.length > 0) {
        countryCode = result[0].countryCode;
        payload.countryCode = countryCode;
      }
    } catch (err) {
      console.error("Map API Error", err);
    }
  }

  payload.completedAt = new Date();

  // Start Transaction
  const session = await startSession();
  try {
    session.startTransaction();

    // Update User with embedded businessDetails
    const updatedUser = await User.findByIdAndUpdate(
      user.authId,
      {
        $set: {
          "businessDetails.addressLine1": payload.addressLine1,
          "status": USER_STATUS.ACTIVE,
          "businessDetails.addressLine2": payload.addressLine2,
          "businessDetails.city": payload.city,
          "businessDetails.postcode": payload.postcode,
          "businessDetails.country": payload.country,
          "businessDetails.countryCode": payload.countryCode || countryCode,
          "businessDetails.businessEmail": payload.businessEmail,
          "businessDetails.telephone": payload.telephone,
          "businessDetails.completedAt": payload.completedAt,
          businessDetailsCompleted: true
        }
      },
      { new: true, runValidators: true, session }
    );

    if (!updatedUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to complete profile");
    }

    // Automatic Property Creation
    await PropertyServices.createProperty(
      { authId: isExistUser._id.toString(), role: isExistUser.role } as JwtPayload,
      {
        propertyName: updatedUser.businessDetails?.businessName || isExistUser.firstName || "Main Business",
        propertyType: "Business",
        addressLine1: payload.addressLine1 || "",
        addressLine2: payload.addressLine2 || "",
        city: payload.city || "",
        postcode: payload.postcode || "",
        country: payload.country || "",
        countryCode: payload.countryCode || countryCode,
        contactEmail: payload.businessEmail || updatedUser.businessDetails?.businessEmail || updatedUser.email,
        contactPhone: payload.telephone || updatedUser.businessDetails?.telephone || "",
      } as any,
      session
    );

    await session.commitTransaction();
    await session.endSession();

    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}

export const UserServices = {
  updateProfile,
  createAdmin,
  getAllUser,
  getSingleUser,
  deleteUser,
  getProfile,
  deleteMyAccount,
  completeProfile,
}