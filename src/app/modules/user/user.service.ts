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
  const userQueryBuilder = new QueryBuilder(
    User.find().select('-password -authentication'),
    query,
  )
    .search(['businessDetails.businessName', 'email'])
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
  const user = await User.findById(id).select('-password -authentication').lean()

  if (!user) {
    return null
  }

  // Only add extra fields for business users
  if (user.role === USER_ROLES.BUSINESS) {
    const aggregateResult = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: 'lostitems',
          localField: '_id',
          foreignField: 'user',
          as: 'lostItems',
        },
      },
      {
        $lookup: {
          from: 'shippings',
          localField: 'lostItems._id',
          foreignField: 'lostItemId',
          as: 'shippings',
        },
      },
      {
        $addFields: {
          totalLostItem: { $size: '$lostItems' },
          activeShipmentsPaymentCompleted: {
            $size: {
              $filter: {
                input: '$shippings',
                as: 'ship',
                cond: { $eq: ['$$ship.status', 'paymentCompleted'] },
              },
            },
          },
          activeShipmentsInTransit: {
            $size: {
              $filter: {
                input: '$shippings',
                as: 'ship',
                cond: { $eq: ['$$ship.status', 'inTransit'] },
              },
            },
          },
        },
      },
      {
        $project: {
          lostItems: 0,
          shippings: 0,
          password: 0,
          authentication: 0,
        },
      },
    ])

    return aggregateResult.length > 0 ? aggregateResult[0] : user
  }

  return user
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
  payload: Partial<IUser> & { businessDetails?: Partial<IBusinessDetails> },
) => {
  const isExistUser = await User.findById(user.authId).lean()

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found or deleted.')
  }

  // Extract business details from payload (nested or flattened)
  const rawPayload = payload as any
  const businessDetailsPayload: Partial<IBusinessDetails> =
    payload.businessDetails || {
      businessName: rawPayload.businessName,
      addressLine1: rawPayload.addressLine1,
      addressLine2: rawPayload.addressLine2,
      city: rawPayload.city,
      postcode: rawPayload.postcode,
      country: rawPayload.country,
      businessEmail: rawPayload.businessEmail,
      telephone: rawPayload.telephone,
    }

  // Address logic for business details
  let countryCode = 'US' // Default fallback
  if (businessDetailsPayload.addressLine1 || businessDetailsPayload.city) {
    const searchQuery = [
      businessDetailsPayload.addressLine1,
      businessDetailsPayload.addressLine2,
      businessDetailsPayload.city,
      businessDetailsPayload.postcode,
      businessDetailsPayload.country,
    ]
      .filter(Boolean)
      .join(', ')

    try {
      const result = await searchLocationsByQuery(searchQuery)
      if (result && result.length > 0) {
        countryCode = result[0].countryCode
      }
    } catch (err) {
      console.error('Map API Error', err)
    }
  }

  // Check if this update completes the profile
  const wasCompleted = isExistUser.businessDetailsCompleted

  if (!wasCompleted) {
    // If first time completion, enforce required fields from the nested object
    if (!businessDetailsPayload.businessName)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Business Name is required for profile completion.',
      )
    if (!businessDetailsPayload.addressLine1)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Address Line 1 is required for profile completion.',
      )
    if (!businessDetailsPayload.city)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'City is required for profile completion.',
      )
    if (!businessDetailsPayload.country)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Country is required for profile completion.',
      )
    if (!businessDetailsPayload.postcode)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Postcode is required for profile completion.',
      )
  }

  // Construct businessDetails update
  const businessDetailsUpdate: any = {}

  if (!isExistUser.businessDetails) {
    // Initialize businessDetails to avoid "Cannot create field ... in element {businessDetails: null}"
    // This block is implicitly handled by the robust object reconstruction below if needed.
  }

  // Allow updating individual fields
  if (businessDetailsPayload.businessName)
    businessDetailsUpdate['businessDetails.businessName'] =
      businessDetailsPayload.businessName
  if (businessDetailsPayload.addressLine1)
    businessDetailsUpdate['businessDetails.addressLine1'] =
      businessDetailsPayload.addressLine1
  if (businessDetailsPayload.addressLine2)
    businessDetailsUpdate['businessDetails.addressLine2'] =
      businessDetailsPayload.addressLine2
  if (businessDetailsPayload.city)
    businessDetailsUpdate['businessDetails.city'] = businessDetailsPayload.city
  if (businessDetailsPayload.postcode)
    businessDetailsUpdate['businessDetails.postcode'] =
      businessDetailsPayload.postcode
  if (businessDetailsPayload.country)
    businessDetailsUpdate['businessDetails.country'] =
      businessDetailsPayload.country
  if (businessDetailsPayload.businessEmail)
    businessDetailsUpdate['businessDetails.businessEmail'] =
      businessDetailsPayload.businessEmail
  if (businessDetailsPayload.telephone)
    businessDetailsUpdate['businessDetails.telephone'] =
      businessDetailsPayload.telephone

  // Handle first-time creation or existing update
  if (
    !isExistUser.businessDetails &&
    Object.keys(businessDetailsUpdate).length > 0
  ) {
    const newBusinessDetails: any = {
      businessName: businessDetailsPayload.businessName,
      addressLine1: businessDetailsPayload.addressLine1,
      addressLine2: businessDetailsPayload.addressLine2,
      city: businessDetailsPayload.city,
      postcode: businessDetailsPayload.postcode,
      country: businessDetailsPayload.country,
      businessEmail: businessDetailsPayload.businessEmail,
      telephone: businessDetailsPayload.telephone,
      countryCode: countryCode,
    }

    if (!wasCompleted) {
      newBusinessDetails.completedAt = new Date()
    }

    // Reset dot notation keys and set full object
    for (const key in businessDetailsUpdate) delete businessDetailsUpdate[key]
    businessDetailsUpdate['businessDetails'] = newBusinessDetails

    if (!wasCompleted) {
      businessDetailsUpdate['businessDetailsCompleted'] = true
      businessDetailsUpdate['status'] = USER_STATUS.ACTIVE
    }
  } else if (Object.keys(businessDetailsUpdate).length > 0) {
    businessDetailsUpdate['businessDetails.countryCode'] = countryCode
    if (!wasCompleted) {
      businessDetailsUpdate['businessDetailsCompleted'] = true
      businessDetailsUpdate['businessDetails.completedAt'] = new Date()
      businessDetailsUpdate['status'] = USER_STATUS.ACTIVE
    }
  }

  const { businessDetails, ...restPayload } = payload
  const updateData = { ...restPayload, ...businessDetailsUpdate }

  // Remove flattened fields to prevent schema errors or junk data
  delete (updateData as any).addressLine1
  delete (updateData as any).addressLine2
  delete (updateData as any).city
  delete (updateData as any).postcode
  delete (updateData as any).country
  delete (updateData as any).businessEmail
  delete (updateData as any).telephone
  delete (updateData as any).businessName

  const session = await startSession()
  try {
    session.startTransaction()

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
        {
          authId: isExistUser._id.toString(),
          role: isExistUser.role,
        } as JwtPayload,
        {
          propertyName:
            updatedUser.businessDetails?.businessName ||
            isExistUser.firstName ||
            'Main Business',
          propertyType: 'Business',
          addressLine1: updatedUser.businessDetails?.addressLine1 || '',
          addressLine2: updatedUser.businessDetails?.addressLine2 || '',
          city: updatedUser.businessDetails?.city || '',
          postcode: updatedUser.businessDetails?.postcode || '',
          country: updatedUser.businessDetails?.country || '',
          countryCode: updatedUser.businessDetails?.countryCode || countryCode,
          contactEmail:
            updatedUser.businessDetails?.businessEmail || updatedUser.email,
          contactPhone: updatedUser.businessDetails?.telephone || '',
          propertyImage: updatedUser.image ? [updatedUser.image] : [],
        } as any,
        session,
      )
    }

    await session.commitTransaction()
    await session.endSession()

    return updatedUser
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

const getProfile = async (user: JwtPayload) => {
  const isExistUser = await User.findById(user.authId)
    .lean()
    .select('-password -authentication')
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

const getAllUsersForExport = async () => {
  return await User.find({ role: USER_ROLES.BUSINESS })
    .select(
      'email firstName lastName businessDetails status verified createdAt',
    )
    .lean()
}

const getAllBusinessUsers = async (searchTerm?: string) => {
  const query: any = {
    role: USER_ROLES.BUSINESS,
    status: USER_STATUS.ACTIVE,
  }

  if (searchTerm) {
    query['businessDetails.businessName'] = { $regex: searchTerm, $options: 'i' }
    query['firstName'] = { $regex: searchTerm, $options: 'i' }
    query['lastName'] = { $regex: searchTerm, $options: 'i' }
  }

  const users = await User.find(query)
    .select('_id firstName lastName image businessDetails.businessName')
    .lean()

  return users
}

export const UserServices = {
  updateProfile,
  createAdmin,
  getAllUser,
  getSingleUser,
  deleteUser,
  getProfile,
  deleteMyAccount,
  getAllUsersForExport,
  getAllBusinessUsers,
}
