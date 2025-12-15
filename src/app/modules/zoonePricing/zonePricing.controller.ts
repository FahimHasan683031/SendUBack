import { Request, Response } from "express";
import { ZonePricingService } from "./zonePricing.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";

// create zone pricing
 const createZonePricingController = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const zonePricing = await ZonePricingService.createZonePricing(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Zone pricing created successfully',
    data: zonePricing,
  });
});

// get all zone pricings
 const getZonePricingsController = catchAsync(async (req: Request, res: Response) => {
  const zonePricings = await ZonePricingService.getZonePricings(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone pricings retrieved successfully',
    data: zonePricings.data,
    meta: zonePricings.meta,
  });
});

// get zone pricing by id
 const getZonePricingByIdController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const zonePricing = await ZonePricingService.getZonePricingById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone pricing retrieved successfully',
    data: zonePricing,
  });
});

// delete zone pricing
 const deleteZonePricingController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const zonePricing = await ZonePricingService.deleteZonePricing(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone pricing deleted successfully',
    data: zonePricing,
  });
});

// update zone pricing
 const updateZonePricingController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const zonePricing = await ZonePricingService.updateZonePricing(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone pricing updated successfully',
    data: zonePricing,
  });
});






export const zonePricingController = {
  createZonePricingController,
  getZonePricingsController,
  getZonePricingByIdController,
  deleteZonePricingController,
  updateZonePricingController,
  
  
}
