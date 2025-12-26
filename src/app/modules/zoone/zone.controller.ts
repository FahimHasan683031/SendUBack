import { Request, Response } from 'express';
import { zoneService } from './zone.service';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';

// CREATE
const createZone = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.createZone(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Zone created',
    data: result,
  });
});

// GET ALL
const getAllZones = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.getAllZones(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zones retrieved',
    data: result,
  });
});

// GET BY ID
const getZoneById = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.getZoneById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone retrieved',
    data: result,
  });
});

// UPDATE
const updateZone = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.updateZone(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone updated',
    data: result,
  });
});

// DELETE
const deleteZone = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.deleteZone(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Zone deleted',
    data: result,
  });
});

// GET BY COUNTRY
const getZoneByCountry = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.getZoneByCountry(req.params.countryCode);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result ? 'Zone found' : 'No zone found',
    data: result,
  });
});

// SEED INITIAL (For setup only)
const seedInitialZones = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.seedInitialZones();
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: result.message,
    data: { count: result.count },
  });
});

export const zoneController = {
  createZone,
  getAllZones,
  getZoneById,
  updateZone,
  deleteZone,
  getZoneByCountry,
  seedInitialZones,
};