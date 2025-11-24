// src/modules/shippo/shippo.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import * as shippoService from "./shippo.service";

const validateAddress = catchAsync(async (req: Request, res: Response) => {
  const address = req.body;
  const result = await shippoService.validateAddress(address);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Address validated",
    data: result,
  });
});

const createParcel = catchAsync(async (req: Request, res: Response) => {
  const parcel = req.body;
  const result = await shippoService.createParcel(parcel);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Parcel created",
    data: result,
  });
});

const getRates = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await shippoService.getRates(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Rates returned",
    data: result,
  });
});

const createShipment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await shippoService.createShipment(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipment created (rates attached)",
    data: result,
  });
});

const buyLabel = catchAsync(async (req: Request, res: Response) => {
  const { rate_object_id, async } = req.body;
  const result = await shippoService.buyLabel(rate_object_id, async);
  const labelUrl = shippoService.getLabelUrlFromTransaction(result);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Label purchased",
    data: {
      transaction: result,
      label_url: labelUrl,
    },
  });
});

const trackShipment = catchAsync(async (req: Request, res: Response) => {
  const { carrier, tracking_number } = req.params;
  const result = await shippoService.trackShipment(carrier, tracking_number);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tracking info",
    data: result,
  });
});

export const shippoControllers = {
  validateAddress,
  createParcel,
  getRates,
  createShipment,
  buyLabel,
  trackShipment,
};
