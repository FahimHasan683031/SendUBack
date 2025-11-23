import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { StatusCodes } from "http-status-codes"
import { lostItemServices } from "./lostItem.service"
import { JwtPayload } from "jsonwebtoken"

// create lost item
const createLostItem = catchAsync(async (req: Request, res: Response) => {
  const lostItem = await lostItemServices.createLostItem(
    req.user as JwtPayload,
    req.body
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lost item created successfully",
    data: lostItem,
  })
})

// get all lost items for a user
const getMyLostItems = catchAsync(async (req: Request, res: Response) => {
  const lostItems = await lostItemServices.getMyLostItems(
    req.user as JwtPayload
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lost items retrieved successfully",
    data: lostItems,
  })
})

// get single lost item
const getSingleLostItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const lostItem = await lostItemServices.getSingleLostItem(
    req.user as JwtPayload,
    id
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lost item retrieved successfully",
    data: lostItem,
  })
})

// update lost item
const updateLostItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const lostItem = await lostItemServices.updateLostItem(
    req.user as JwtPayload,
    id,
    req.body
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lost item updated successfully",
    data: lostItem,
  })
})

// delete lost item
const deleteLostItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const lostItem = await lostItemServices.deleteLostItem(
    req.user as JwtPayload,
    id
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lost item deleted successfully",
    data: lostItem,
  })
})

export const lostItemControllers = {
  createLostItem,
  getMyLostItems,
  getSingleLostItem,
  updateLostItem,
  deleteLostItem,
}