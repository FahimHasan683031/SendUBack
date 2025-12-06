// src/modules/shipping/shipping.route.ts
import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { shippingController } from "./shipping.controller";
import {
  createShippingZod,
  updateShippingZod,
  addTrackingInfoZod,
} from "./shipping.validation";

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
  shippingController.getAllShippings
);

;

// Get shipping by tracking ID
router.get(
  "/track/:trackingId",
  shippingController.getShippingByTrackingId
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
  "/:id/tracking",
  validateRequest(addTrackingInfoZod),
  shippingController.addTrackingInfo
);

// Delete shipping
router.delete(
  "/:id",
  shippingController.deleteShipping
);

export const shippingRoutes = router;