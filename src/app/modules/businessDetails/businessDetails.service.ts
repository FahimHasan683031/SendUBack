import { JwtPayload } from 'jsonwebtoken'
import { IBusinessDetails } from './businessDetails.interface'
import { BusinessDetails } from './businessDetails.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'

// update business details
export const updateBusinessDetails = async (
  user: JwtPayload,
  payload: IBusinessDetails,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  const isExistBusinessDetails = await BusinessDetails.findOne({
    userId: user.authId,
  })
  if (!isExistBusinessDetails) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Business details not found')
  }
  const businessDetails = await BusinessDetails.findOneAndUpdate(
    { userId: user.authId },
    payload,
    { new: true },
  )
  return businessDetails
}

export const businessDetailsServices = {
  updateBusinessDetails,
}
