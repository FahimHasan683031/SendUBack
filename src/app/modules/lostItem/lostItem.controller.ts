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
const getAllLostItems = catchAsync(async (req: Request, res: Response) => {
  const lostItems = await lostItemServices.getAllLostItems(
    req.user as JwtPayload,
    req.query
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

// add or replace image for a lost item
const addOrReplaceImages = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const lostItem = await lostItemServices.addOrReplaceImages(
    id,
    req.body.images
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lost item images updated successfully",
    data: lostItem.images,
  })
})

// send guest email
const sendGestEmail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  await lostItemServices.sendGestEmail(
    id
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Guest email sent successfully",
  })
})

// update status
const updateLostItemStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body
  const result = await lostItemServices.updateLostItemStatus(id, status)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Status updated successfully",
    data: result,
  })
})

// mark as collected
const markAsCollected = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await lostItemServices.markAsCollected(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Item marked as collected successfully",
    data: result,
  })
})

export const lostItemControllers = {
  createLostItem,
  getAllLostItems,
  getSingleLostItem,
  updateLostItem,
  deleteLostItem,
  addOrReplaceImages,
  sendGestEmail,
  updateLostItemStatus,
  markAsCollected
}