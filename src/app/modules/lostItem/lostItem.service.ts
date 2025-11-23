import { JwtPayload } from 'jsonwebtoken'
import { ILostItem } from './lostItem.interface'
import { LostItem } from './lostItem.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'

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
  user: JwtPayload,
  id: string,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  
  const lostItem = await LostItem.findOne({ _id: id, userId: user.authId })
  if (!lostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }
  return lostItem
}

// update lost item
export const updateLostItem = async (
  user: JwtPayload,
  id: string,
  payload: Partial<ILostItem>,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  
  const isExistLostItem = await LostItem.findOne({ _id: id, userId: user.authId })
  if (!isExistLostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }
  
  const lostItem = await LostItem.findOneAndUpdate(
    { _id: id, userId: user.authId },
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
  
  const isExistLostItem = await LostItem.findOne({ _id: id, userId: user.authId })
  if (!isExistLostItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lost item not found')
  }
  
  const lostItem = await LostItem.findOneAndDelete({ _id: id, userId: user.authId })
  return lostItem
}

export const lostItemServices = {
  createLostItem,
  getMyLostItems,
  getSingleLostItem,
  updateLostItem,
  deleteLostItem,
}