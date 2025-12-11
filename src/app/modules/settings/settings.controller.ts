import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SettingsService } from "./settings.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

// Create settings
const createSettings = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await SettingsService.createSettings(payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Settings created successfully",
    data: result,
  });
});

// Get settings
const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getSettings();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Settings retrieved successfully",
    data: result,
  });
});


export const SettingsController = {
    createSettings,
    getSettings
}
