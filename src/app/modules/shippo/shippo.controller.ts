import { Request, Response } from "express";
import { shippoService } from "./shippo.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

// create shipment
const createShipment = async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await shippoService.createShipment(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Shipment created successfully",
    data: result,
  });
};

// get all shipments
const getAllShipments = async (req: Request, res: Response) => {
  const result = await shippoService.getAllShipments(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipments retrieved successfully",
    data: result,
  });
};

// get shipping rates
const getShippingRates = async (req: Request, res: Response) => {
  const { shipmentId } = req.params;
  const result = await shippoService.getShippingRates(shipmentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipping rates retrieved successfully",
    data: result,
  });
};

// purchase label
const purchaseLabel = async (req: Request, res: Response) => {
  const { rateId, shipmentId } = req.body;
  const result = await shippoService.purchaseLabel(rateId, shipmentId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Label purchased successfully",
    data: result,
  });
};

// validate address
const validateAddress = async (req: Request, res: Response) => {
  const address = req.body;
  const result = await shippoService.validateAddress(address);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Address validated successfully",
    data: result,
  });
};

// track shipment
const trackShipment = async (req: Request, res: Response) => {
  const { carrier, trackingNumber } = req.params;
  const result = await shippoService.trackShipment(carrier, trackingNumber);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Tracking information retrieved successfully",
    data: result,
  });
};

// get shipment by id
const getShipmentById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await shippoService.getShipmentById(id);
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
  const result = await shippoService.updateShipment(id, payload);
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
  const result = await shippoService.deleteShipment(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shipment deleted successfully",
    data: result,
  });
};

export const shippoController = {
  createShipment,
  getAllShipments,
  getShippingRates,
  purchaseLabel,
  validateAddress,
  trackShipment,
  getShipmentById,
  updateShipment,
  deleteShipment
};