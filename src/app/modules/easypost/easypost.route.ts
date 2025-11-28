import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { easypostController } from "./easypost.controller";
import { 
  createShipmentZod, 
  purchaseLabelZod, 
  createPickupZod, 
  trackShipmentZod 
} from "./easypost.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(createShipmentZod),
  easypostController.createShipment
);

router.get(
  "/",
  easypostController.getAllShipments
);

router.get(
  "/:id",
  easypostController.getShipmentById
);

router.patch(
  "/:id",
  easypostController.updateShipment
);

router.post(
  "/purchase-label",
  validateRequest(purchaseLabelZod),
  easypostController.purchaseLabel
);

router.post(
  "/schedule-pickup",
  validateRequest(createPickupZod),
  easypostController.createPickup
);

router.post(
  "/validate-address",
  easypostController.validateAddress
);

router.get(
  "/track/:trackingCode",
  validateRequest(trackShipmentZod),
  easypostController.trackShipment
);

router.delete(
  "/:id",
  easypostController.deleteShipment
);

export const easypostRoutes = router;