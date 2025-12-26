import { JwtPayload } from 'jsonwebtoken'
import { IBusinessDetails } from './businessDetails.interface'
import { BusinessDetails } from './businessDetails.model'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import { searchLocationsByQuery } from '../../../utils/googleMapsAddress.util'

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
  if (payload.address) {
    const searchQuery = [
      payload.address.street1,
      payload.address.city,
      payload.address.state,
      payload.address.postal_code,
      payload.address.country,
    ]
      .filter(Boolean)
      .join(', ')

    const result = await searchLocationsByQuery(searchQuery)

    if (result && result.length > 0) {
      payload.address.countryCode = result[0].countryCode
    }
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
