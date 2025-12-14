import express from "express";

import {
  createZonePricingValidationSchema,
  updateZonePricingValidationSchema,
  calculateShippingRateValidationSchema,
} from "./zonePricing.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { zonePricingController } from "./zonePricing.controller";

const router = express.Router();

router.route("/")
  .post(
    auth('admin'),
    validateRequest(createZonePricingValidationSchema),
    zonePricingController.createZonePricingController
  )
  .get(
    auth('admin'),
    zonePricingController.getZonePricingsController
  );

router.route("/get-shipping-rate")
  .post(
    validateRequest(calculateShippingRateValidationSchema),
    zonePricingController.calculateShippingRateController
  );




router.route("/:id")
  .get(
    zonePricingController.getZonePricingByIdController
  )
  .patch(
    auth('admin'),
    validateRequest(updateZonePricingValidationSchema),
    zonePricingController.updateZonePricingController
  )
  .delete(
    auth('admin'),
    zonePricingController.deleteZonePricingController
  );

export const zonePricingRoutes = router;