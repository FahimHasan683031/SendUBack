import { Request, Response } from "express";
import { shippingService } from "./shipping.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";


// Create shipping
const createShipping = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await shippingService.createShipping(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Shipping created successfully",
    data: result,
  });
});

// Get all shippings
const getAllShippings = catchAsync(async (req: Request, res: Response) => {
  const result = await shippingService.getAllShippings(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shippings retrieved successfully",
    data: result,
  });
});

// Get shipping by ID
const getShippingById = catchAsync(async (req: Request, res: Response) => { 
  const { id } = req.params;
  const result = await shippingService.getShippingById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping retrieved successfully",
    data: result,
  });
});



// Get shipping by tracking ID
const getShippingByTrackingId = catchAsync(async (req: Request, res: Response) => {
  const { trackingId } = req.params;
  const result = await shippingService.getShippingByTrackingId(trackingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping retrieved successfully",
    data: result,
  });
});     

// Update shipping
const updateShipping = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await shippingService.updateShipping(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping updated successfully",
    data: result,
  });
});




// Add tracking information
const addTrackingInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tracking_id, tracking_url, carrier } = req.body;
  const result = await shippingService.addTrackingInfo(id, tracking_id, tracking_url, carrier);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tracking information added successfully",
    data: result,
  });
});

// Delete shipping
const deleteShipping = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await shippingService.deleteShipping(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping deleted successfully",
    data: result,
  });
});

// Calculate shipping rates
const getShippingRates = catchAsync(async (req: Request, res: Response) => {
  const result = await shippingService.getShippingRates(req.params.shippingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping rates calculated successfully",
    data: result,
  });
});



export const shippingController = {
  createShipping,
  getAllShippings,
  getShippingById,
  getShippingByTrackingId,
  updateShipping,
  addTrackingInfo,
  deleteShipping,
  getShippingRates
};