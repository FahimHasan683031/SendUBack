import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import { AuthCommonServices } from "../auth/common"
import sendResponse from "../../../shared/sendResponse"
import { StatusCodes } from "http-status-codes"
import { businessDetailsServices } from "./businessDetails.service"
import { JwtPayload } from "jsonwebtoken"

// update business details
const updateBusinessDetails = catchAsync(async (req: Request, res: Response) => {

  const businessDetails = await businessDetailsServices.updateBusinessDetails(
    req.user as JwtPayload,
    req.body
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Business details updated successfully",
    data: businessDetails,
  })
})

// complete profile
const completeProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await businessDetailsServices.completeProfile(
    req.user as JwtPayload,
    req.body
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile completed successfully",
    data: result,
  })
})

export const businessDetailsControllers = {
  updateBusinessDetails,
  completeProfile
}