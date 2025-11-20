import { USER_STATUS } from '../../../../enum/user'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../../errors/ApiError'
import { User } from '../../user/user.model'
import { IUser, USER_ROLES } from '../../user/user.interface'
import { AuthHelper } from '../auth.helper'
import { IAuthResponse } from '../auth.interface'
import { authResponse } from '../common'

const handleGoogleLogin = async (payload: IUser & { profile: any }): Promise<IAuthResponse> => {
  const { emails, photos, displayName, id } = payload.profile
  const email = emails[0].value.toLowerCase().trim()
  
  const isUserExist = await User.findOne({
    email,
    status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
  })
  
  if (isUserExist) {
    const tokens = AuthHelper.createToken(
      isUserExist._id, 
      isUserExist.role, 
      `${isUserExist.firstName} ${isUserExist.lastName}`,
      isUserExist.email
    )
    return authResponse(
      StatusCodes.OK, 
      `Welcome ${isUserExist.firstName} to our platform.`, 
      isUserExist.role, 
      tokens.accessToken, 
      tokens.refreshToken
    )
  }

  const session = await User.startSession()
  session.startTransaction()

  // Split display name into first and last name
  const names = displayName.split(' ')
  const firstName = names[0] || ''
  const lastName = names.slice(1).join(' ') || 'User'

  const userData = {
    email: emails[0].value,
    firstName: firstName,
    lastName: lastName,
    verified: true,
    password: id,
    status: USER_STATUS.ACTIVE,
    role: USER_ROLES.Business,
    authentication: {
      oneTimeCode: '',
      restrictionLeftAt: null,
      resetPassword: false,
      wrongLoginAttempts: 0,
      latestRequestAt: new Date(),
    },
  }

  try {
    const user = await User.create([userData], { session })
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user')
    }
    const createdUser = user[0]

    // Create token
    const tokens = AuthHelper.createToken(
      createdUser._id, 
      createdUser.role, 
      `${createdUser.firstName} ${createdUser.lastName}`,
      createdUser.email
    )

    await session.commitTransaction()
    await session.endSession()

    return authResponse(
      StatusCodes.OK, 
      `Welcome ${createdUser.firstName} to our platform.`, 
      createdUser.role, 
      tokens.accessToken, 
      tokens.refreshToken
    )
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

export const PassportAuthServices = {
  handleGoogleLogin,
}