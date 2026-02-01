import { Request, Response } from "express";
import { shippingService } from "./shipping.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { JwtPayload } from 'jsonwebtoken';
import { ExportUtils } from "../../../utils/export.util";


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
  const result = await shippingService.getAllShippings(req.query, req.user as JwtPayload);
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

// Add shipping rate OR insurance
const addShippingRateORInsurance = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await shippingService.addShippingRateORInsurance(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping rate or insurance added successfully",
    data: result,
  });
});



// Add shipping information
const addShippingInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await shippingService.addShippingInfo(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping information added successfully",
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
  });
});

// Calculate shipping rates
const getShippingRates = catchAsync(async (req: Request, res: Response) => {
  const result = await shippingService.getShippingRates(req.params.shippingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping rates retrieved successfully",
    data: result,
  });
});



// Search locations using Google Maps API
const searchLocations = catchAsync(async (req: Request, res: Response) => {
  const { search, type } = req.query;
  const result = await shippingService.searchLocations(search as string, type as string);

  // Send response in the exact format matching the hotel API
  res.status(StatusCodes.OK).json({
    status: "ok",
    data: result,
  });
});

// mark as delivered
const markAsDelivered = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await shippingService.markAsDelivered(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping marked as delivered successfully",
    data: result,
  })
})



// Export shippings
const exportShippings = catchAsync(async (req: Request, res: Response) => {
  const shippings = await shippingService.getAllShippingsForExport(req.user as JwtPayload);

  const data = shippings.map((item: any) => ({
    "Tracking ID": item.tracking_id,
    "From Name": item.address_from.name,
    "From Country": item.address_from.country,
    "To Name": item.address_to.name,
    "To Country": item.address_to.country,
    "Status": item.status,
    "Cost": item.total_cost || 0,
    "Created At": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
  }));

  const format = req.query.format as string || 'csv';
  const fileName = "Shippings_Export";

  if (format === 'xlsx') {
    const columns = [
      { header: 'Tracking ID', key: 'Tracking ID', width: 25 },
      { header: 'From Name', key: 'From Name', width: 20 },
      { header: 'From Country', key: 'From Country', width: 15 },
      { header: 'To Name', key: 'To Name', width: 20 },
      { header: 'To Country', key: 'To Country', width: 15 },
      { header: 'Status', key: 'Status', width: 15 },
      { header: 'Cost', key: 'Cost', width: 10 },
      { header: 'Created At', key: 'Created At', width: 15 },
    ];
    await ExportUtils.toExcel(res, data, columns, "Shippings", fileName);
  } else {
    const fields = ["Tracking ID", "From Name", "From Country", "To Name", "To Country", "Status", "Cost", "Created At"];
    await ExportUtils.toCSV(res, data, fields, fileName);
  }
});

export const shippingController = {
  createShipping,
  getAllShippings,
  getShippingById,
  updateShipping,
  deleteShipping,
  getShippingRates,
  addShippingInfo,
  addShippingRateORInsurance,
  searchLocations,
  markAsDelivered,
  exportShippings
};