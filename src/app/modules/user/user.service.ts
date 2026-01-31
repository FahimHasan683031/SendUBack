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
  payload: Partial<IUser> & Partial<IBusinessDetails>,
) => {
  const isExistUser = await User.findById(user.authId)

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found or deleted.')
  }



  // Address logic for business details
  let countryCode = "US"; // Default fallback
  if (payload.addressLine1 || payload.city) {
    const searchQuery = [
      payload.addressLine1,
      payload.addressLine2,
      payload.city,
      payload.postcode,
      payload.country,
    ]
      .filter(Boolean)
      .join(', ')

    try {
      const result = await searchLocationsByQuery(searchQuery);
      if (result && result.length > 0) {
        countryCode = result[0].countryCode;
      }
    } catch (err) {
      console.error("Map API Error", err);
    }
  }

  // Check if this update completes the profile
  const wasCompleted = isExistUser.businessDetailsCompleted;

  if (!wasCompleted) {
    // If first time completion, enforce required fields
    if (!payload.businessName) throw new ApiError(StatusCodes.BAD_REQUEST, "Business Name is required for profile completion.");
    if (!payload.addressLine1) throw new ApiError(StatusCodes.BAD_REQUEST, "Address Line 1 is required for profile completion.");
    if (!payload.city) throw new ApiError(StatusCodes.BAD_REQUEST, "City is required for profile completion.");
    if (!payload.country) throw new ApiError(StatusCodes.BAD_REQUEST, "Country is required for profile completion.");
    if (!payload.postcode) throw new ApiError(StatusCodes.BAD_REQUEST, "Postcode is required for profile completion.");
  }

  // Construct businessDetails update if fields are present
  // We use dot notation for update
  const businessDetailsUpdate: any = {};
  if (payload.businessName) businessDetailsUpdate["businessDetails.businessName"] = payload.businessName;
  if (payload.addressLine1) businessDetailsUpdate["businessDetails.addressLine1"] = payload.addressLine1;
  if (payload.addressLine2) businessDetailsUpdate["businessDetails.addressLine2"] = payload.addressLine2;
  if (payload.city) businessDetailsUpdate["businessDetails.city"] = payload.city;
  if (payload.postcode) businessDetailsUpdate["businessDetails.postcode"] = payload.postcode;
  if (payload.country) businessDetailsUpdate["businessDetails.country"] = payload.country;
  if (payload.businessEmail) businessDetailsUpdate["businessDetails.businessEmail"] = payload.businessEmail;
  if (payload.telephone) businessDetailsUpdate["businessDetails.telephone"] = payload.telephone;

  if (Object.keys(businessDetailsUpdate).length > 0) {
    businessDetailsUpdate["businessDetails.countryCode"] = countryCode;
    if (!wasCompleted) {
      businessDetailsUpdate["businessDetailsCompleted"] = true;
      businessDetailsUpdate["businessDetails.completedAt"] = new Date();
      businessDetailsUpdate["status"] = USER_STATUS.ACTIVE;
    }
  }

  // Merge payload with flattened business details

  const updateData = { ...payload, ...businessDetailsUpdate };

  // Remove flattened fields from payload
  delete (updateData as any).addressLine1;
  delete (updateData as any).addressLine2;
  delete (updateData as any).city;
  delete (updateData as any).postcode;
  delete (updateData as any).country;
  delete (updateData as any).businessEmail; // carefully not to remove root email
  delete (updateData as any).telephone;
  delete (updateData as any).businessName;


  const session = await startSession();
  try {
    session.startTransaction();

    const updatedUser = await User.findOneAndUpdate(
      { _id: user.authId, status: { $ne: USER_STATUS.DELETED } },
      updateData,
      { new: true, session },
    )

    if (!updatedUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update profile')
    }

    // Auto-create property if profile is completed for the first time
    if (!wasCompleted && updatedUser.businessDetailsCompleted) {
      await PropertyServices.createProperty(
        { authId: isExistUser._id.toString(), role: isExistUser.role } as JwtPayload,
        {
          propertyName: updatedUser.businessDetails?.businessName || isExistUser.firstName || "Main Business",
          propertyType: "Business",
          addressLine1: updatedUser.businessDetails?.addressLine1 || "",
          addressLine2: updatedUser.businessDetails?.addressLine2 || "",
          city: updatedUser.businessDetails?.city || "",
          postcode: updatedUser.businessDetails?.postcode || "",
          country: updatedUser.businessDetails?.country || "",
          countryCode: updatedUser.businessDetails?.countryCode || countryCode,
          contactEmail: updatedUser.businessDetails?.businessEmail || updatedUser.email,
          contactPhone: updatedUser.businessDetails?.telephone || "",
          propertyImage: updatedUser.image ? [updatedUser.image] : [],
        } as any,
        session
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return updatedUser;

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
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

export const UserServices = {
  updateProfile,
  createAdmin,
  getAllUser,
  getSingleUser,
  deleteUser,
  getProfile,
  deleteMyAccount,
}