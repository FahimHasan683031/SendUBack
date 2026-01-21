import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { shippingController } from "./shipping.controller";
import {
  addShippingInfo,
  createShippingZod,
  updateShippingZod,
} from "./shipping.validation";
import { fileAndBodyProcessorUsingDiskStorage } from "../../middleware/processReqBody";
import { USER_ROLES } from "../user/user.interface";
import auth from "../../middleware/auth";

const router = express.Router();

// get shipping rates
router.post(
  "/getShippingRates/:shippingId",
  shippingController.getShippingRates
);

// Create shipping
router.post(
  "/",
  validateRequest(createShippingZod),
  shippingController.createShipping
);

// Get all shippings
router.get(
  "/",
  auth(USER_ROLES.BUSINESS, USER_ROLES.ADMIN),
  shippingController.getAllShippings
);

// Add shipping rate OR insurance
router.post(
  "/addRateOrInsurance/:id",
  validateRequest(updateShippingZod),
  shippingController.addShippingRateORInsurance
);



// Search locations using Google Maps API
router.get(
  "/searchLocations",
  shippingController.searchLocations
);

// Get shipping by ID
router.get(
  "/:id",
  shippingController.getShippingById
);

// Update shipping
router.patch(
  "/:id",
  validateRequest(updateShippingZod),
  shippingController.updateShipping
);
// Add tracking information
router.post(
  "/:id/shippingInfo",
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(addShippingInfo),
  shippingController.addShippingInfo
);

// Delete shipping
router.delete(
  "/:id",
  shippingController.deleteShipping
);



export const shippingRoutes = router;