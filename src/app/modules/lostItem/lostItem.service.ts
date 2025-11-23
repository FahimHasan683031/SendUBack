import { JwtPayload } from 'jsonwebtoken'
import { ILostItem } from './lostItem.interface'
import { LostItem } from './lostItem.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import { USER_ROLES } from '../user/user.interface'

// create lost item
export const createLostItem = async (
  user: JwtPayload,
  payload: ILostItem,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  
  const lostItem = await LostItem.create({
    ...payload,
    userId: user.authId
  })
  return lostItem
}

// get all lost items for a user
export const getMyLostItems = async (
  user: JwtPayload,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  
  const lostItems = await LostItem.find({ userId: user.authId })
  return lostItems
}

// get single lost item
export const getSingleLostItem = async (
  id: string,
) => {
 
  const lostItem = await LostItem.findOne({ _id: id })
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
  if(isExistUser.role !== USER_ROLES.Business && isExistUser.role !== USER_ROLES.ADMIN){
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this lost item')
  }
  
  const isExistLostItem = await LostItem.findOne({ _id: id })
  if (!isExistLostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }
  
  const lostItem = await LostItem.findOneAndDelete({ _id: id})
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

export const lostItemServices = {
  createLostItem,
  getMyLostItems,
  getSingleLostItem,
  updateLostItem,
  deleteLostItem,
  addOrReplaceImages
}