// src/modules/shipping/shipping.route.ts
import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { shippingController } from "./shipping.controller";
import { 
  createShippingZod, 
  updateShippingZod,
  updateStatusZod,
  addShippingLabelZod,
  addTrackingInfoZod
} from "./shipping.validation";

const router = express.Router();

// Create shipping
router.post(
  "/create",
  validateRequest(createShippingZod),
  shippingController.createShipping
);

// Get all shippings
router.get(
  "/",
  shippingController.getAllShippings
);

// Get shipping by ID
router.get(
  "/:id",
  shippingController.getShippingById
);

// Get shipping by order ID
router.get(
  "/order/:orderId",
  shippingController.getShippingByOrderId
);

// Get shipping by tracking ID
router.get(
  "/track/:trackingId",
  shippingController.getShippingByTrackingId
);

// Update shipping
router.patch(
  "/:id",
  validateRequest(updateShippingZod),
  shippingController.updateShipping
);

// Update shipping status
router.patch(
  "/:id/status",
  validateRequest(updateStatusZod),
  shippingController.updateShippingStatus
);

// Add shipping label
router.post(
  "/:id/label",
  validateRequest(addShippingLabelZod),
  shippingController.addShippingLabel
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