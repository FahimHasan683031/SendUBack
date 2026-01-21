import { JwtPayload } from 'jsonwebtoken'
import { ILostItem } from './lostItem.interface'
import { LostItem } from './lostItem.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '../user/user.interface'
import { emailHelper } from '../../../helpers/emailHelper'
import { emailTemplate } from '../../../shared/emailTemplate'
import { logger } from '../../../shared/logger'
import QueryBuilder from '../../builder/QueryBuilder'

// create lost item
export const createLostItem = async (
  user: JwtPayload,
  payload: ILostItem,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (isExistUser.role === USER_ROLES.BUSINESS) {
    const businessDetails = isExistUser.businessDetails;
    if (!businessDetails) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Business details are required')
    }
    if (
      !businessDetails.addressLine1 ||
      !businessDetails.businessEmail ||
      !businessDetails.businessName ||
      !businessDetails.telephone
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Please complete your business details (Address, Email, Name, Phone) before adding a lost item',
      )
    }
  }

  const lostItem = await LostItem.create({
    ...payload,
    user: user.authId
  })
  return lostItem
}

// get all lost items for a user
export const getAllLostItems = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (isExistUser.role === USER_ROLES.BUSINESS) {
    query.user = isExistUser._id
  }
  const lostQueryBiilder = new QueryBuilder(LostItem.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields()

  const lostItems = await lostQueryBiilder.modelQuery
  const paginateInfo = await lostQueryBiilder.getPaginationInfo()



  return {
    lostItems,
    meta: paginateInfo
  }
}

// get single lost item
export const getSingleLostItem = async (id: string) => {
  const lostItem = await LostItem.findById(id)
    .populate({
      path: 'user',
      select: '-authentication -password -__v',
    })

  if (!lostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }

  return lostItem
}


// update lost item
export const updateLostItem = async (
  id: string,
  payload: Partial<ILostItem>,
) => {

  const isExistLostItem = await LostItem.findOne({ _id: id })
  if (!isExistLostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }

  const lostItem = await LostItem.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  )
  return lostItem
}

// delete lost item
export const deleteLostItem = async (
  user: JwtPayload,
  id: string,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  if (isExistUser.role !== USER_ROLES.BUSINESS && isExistUser.role !== USER_ROLES.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this lost item')
  }

  const isExistLostItem = await LostItem.findOne({ _id: id })
  if (!isExistLostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }

  const lostItem = await LostItem.findOneAndDelete({ _id: id })
  return lostItem
}

const addOrReplaceImages = async (
  itemId: string,
  images: string[],
) => {
  const item = await LostItem.findById(itemId);
  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Lost item not found");
  }
  // Update images
  item.images = images;
  await item.save();

  //@ts-ignore
  const io = global.io
  if (io && itemId) {
    // send message to specific chatId Room
    io.emit(`getImages::${itemId}`, item)
  }
  return item;
};

const sendGestEmail = async (lostItemId: string) => {
  const lostItem = await LostItem.findById(lostItemId).populate({
    path: 'user',
    select: '-authentication -password -__v',
  })
  if (!lostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }
  if (!lostItem.guestEmail) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Guest email not found')
  }
  setTimeout(() => {
    try {
      emailHelper.sendEmail(emailTemplate.guestLostItemNotificationEmail(lostItem))
    } catch (error) {
      logger.error('Failed to send guest lost item notification email:', error)
    }
  }, 0)
  return {
    message: "Guest email sent successfully",
  }
}

export const lostItemServices = {
  createLostItem,
  getAllLostItems,
  getSingleLostItem,
  updateLostItem,
  deleteLostItem,
  addOrReplaceImages,
  sendGestEmail
}