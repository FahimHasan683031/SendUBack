import { Request, Response } from "express";
import { easypostService } from "./easypost.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

// create shipment
const createShipment = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await easypostService.createShipment(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Shipment created successfully",
    data: result,
  });
};

// get all shipments
const getAllShipments = async (req: Request, res: Response) => {
  const result = await easypostService.getAllShipments(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipments retrieved successfully",
    data: result,
  });
};

// purchase label
const purchaseLabel = async (req: Request, res: Response) => {
  const { rateId, shipmentId } = req.body;
  const result = await easypostService.purchaseLabel(rateId, shipmentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Label purchased successfully",
    data: result,
  });
};

// create pickup
const createPickup = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await easypostService.createPickup(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Pickup scheduled successfully",
    data: result,
  });
};

// track shipment
const trackShipment = async (req: Request, res: Response) => {
  const { trackingCode } = req.params;
  const result = await easypostService.trackShipment(trackingCode);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tracking information retrieved successfully",
    data: result,
  });
};

// validate address
const validateAddress = async (req: Request, res: Response) => {
  const address = req.body;
  const result = await easypostService.validateAddress(address);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Address validated successfully",
    data: result,
  });
};

// get shipment by id
const getShipmentById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await easypostService.getShipmentById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipment retrieved successfully",
    data: result,
  });
};

// update shipment
const updateShipment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await easypostService.updateShipment(id, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipment updated successfully",
    data: result,
  });
};

// delete shipment
const deleteShipment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await easypostService.deleteShipment(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipment deleted successfully",
    data: result,
  });
};

export const easypostController = {
  createShipment,
  getAllShipments,
  purchaseLabel,
  createPickup,
  trackShipment,
  validateAddress,
  getShipmentById,
  updateShipment,
  deleteShipment
};