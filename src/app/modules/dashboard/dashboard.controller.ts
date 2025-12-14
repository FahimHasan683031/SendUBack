import { StatusCodes } from "http-status-codes"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { Request, Response } from 'express';
import { JwtPayload } from "jsonwebtoken";
import { DshboardServices } from "./dashboard.service";

const getDashboardStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DshboardServices.getDashboardOverview()
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Dashboard statistics fetched successfully',
    data: result,
  })
})

const getBusinessDashboardStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DshboardServices.businessDashboardOverview(req.user as JwtPayload)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Business dashboard statistics fetched successfully',
    data: result,
  })
})




export const DashboardControllers = {
  getDashboardStatistics,
  getBusinessDashboardStatistics
}