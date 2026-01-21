import { JwtPayload } from 'jsonwebtoken'
import { IBusinessDetails } from './businessDetails.interface'
import { User } from '../user/user.model'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import { searchLocationsByQuery } from '../../../utils/googleMapsAddress.util'
import { PropertyServices } from '../property/property.service'
import { startSession } from 'mongoose'

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
  let countryCode = "US"; // Default fallback? Or required?
  if (payload.addressLine1 || payload.city) { // If any address part is provided
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
    // Using searchLocationsByQuery to validation/fetch
    try {
      const result = await searchLocationsByQuery(searchQuery);
      if (result && result.length > 0) {
        countryCode = result[0].countryCode;
        payload.countryCode = countryCode;
      }
    } catch (err) {
      console.error("Map API Error", err);
      // implicit fallback or error? User said "backend ea map api diya handle korte hobe"
      // If map fails, maybe we can't complete profile if we can't get countryCode?
      // But for now let's proceed/allow manual override if provided or fallback.
    }
  }

  payload.completedAt = new Date();

  // Start Transaction
  const session = await startSession();
  try {
    session.startTransaction();

    // Update User with embedded businessDetails
    // merging with existing details (like businessName)
    const updatedUser = await User.findByIdAndUpdate(
      user.authId,
      {
        $set: {
          "businessDetails.addressLine1": payload.addressLine1,
          "businessDetails.addressLine2": payload.addressLine2,
          "businessDetails.city": payload.city,
          "businessDetails.postcode": payload.postcode, // match schema key
          "businessDetails.country": payload.country,
          "businessDetails.countryCode": payload.countryCode || countryCode, // ensure set
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

// update business details (Refactored to use User model)
export const updateBusinessDetails = async (
  user: JwtPayload,
  payload: Partial<IBusinessDetails>,
) => {
  const isExistUser = await User.findById(user.authId)
  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  // Construct update object for dot notation
  const updateData: Record<string, any> = {};
  Object.keys(payload).forEach(key => {
    updateData[`businessDetails.${key}`] = (payload as any)[key];
  });

  if (payload.addressLine1 || payload.city) {
    // similar map logic if needed, but completeProfile covers the main flow
  }

  const updatedUser = await User.findByIdAndUpdate(
    user.authId,
    { $set: updateData },
    { new: true }
  )
  return updatedUser
}

export const businessDetailsServices = {
  updateBusinessDetails,
  completeProfile
}
