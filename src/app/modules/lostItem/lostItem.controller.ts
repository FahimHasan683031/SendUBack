import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { StatusCodes } from "http-status-codes"
import { lostItemServices } from "./lostItem.service"
import { JwtPayload } from "jsonwebtoken"
import { ExportUtils } from "../../../utils/export.util"

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
    id,
    req.body.email
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

// export lost items
const exportLostItems = catchAsync(async (req: Request, res: Response) => {
  const items = await lostItemServices.getAllLostItemsForExport(req.user as JwtPayload);

  const data = items.map((item: any) => ({
    "Item Name": item.itemName || "N/A",
    "Description": item.description || "",
    "Property Name": item.property?.propertyName || "N/A",
    "Found By": `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(),
    "Guest Name": item.guestName || "N/A",
    "Guest Email": item.guestEmail || "N/A",
    "Found Date": item.foundDate ? new Date(item.foundDate).toLocaleDateString() : "",
    "Status": item.status,
  }));

  const format = req.query.format as string || 'csv';
  const fileName = "Lost_Items_Export";

  if (format === 'xlsx') {
    const columns = [
      { header: 'Item Name', key: 'Item Name', width: 20 },
      { header: 'Description', key: 'Description', width: 30 },
      { header: 'Property Name', key: 'Property Name', width: 20 },
      { header: 'Found By', key: 'Found By', width: 20 },
      { header: 'Guest Name', key: 'Guest Name', width: 20 },
      { header: 'Guest Email', key: 'Guest Email', width: 25 },
      { header: 'Found Date', key: 'Found Date', width: 15 },
      { header: 'Status', key: 'Status', width: 15 },
    ];
    await ExportUtils.toExcel(res, data, columns, "LostItems", fileName);
  } else {
    const fields = ["Item Name", "Description", "Property Name", "Found By", "Guest Name", "Guest Email", "Found Date", "Status"];
    await ExportUtils.toCSV(res, data, fields, fileName);
  }
});

export const lostItemControllers = {
  createLostItem,
  getAllLostItems,
  getSingleLostItem,
  updateLostItem,
  deleteLostItem,
  addOrReplaceImages,
  sendGestEmail,
  updateLostItemStatus,
  markAsCollected,
  exportLostItems
}