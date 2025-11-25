import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { shippoController } from "./shippo.controller";
import { 
  createShipmentZod, 
  updateShipmentZod,
  purchaseLabelZod, 
  getRatesZod, 
  trackShipmentZod,
  validateAddressZod
} from "./shippo.validation";

const router = express.Router();


router.post(
  "/create",
  validateRequest(createShipmentZod),
  shippoController.createShipment
);

router.get(
  "/",
  shippoController.getAllShipments
);

router.get(
  "/:id",
  shippoController.getShipmentById
);

router.patch(
  "/:id",
  validateRequest(updateShipmentZod),
  shippoController.updateShipment
);

router.get(
  "/rates/:shipmentId",
  validateRequest(getRatesZod),
  shippoController.getShippingRates
);

router.post(
  "/purchase-label",
  validateRequest(purchaseLabelZod),
  shippoController.purchaseLabel
);

router.post(
  "/address",
  validateRequest(validateAddressZod),
  shippoController.validateAddress
);

router.get(
  "/track/:carrier/:trackingNumber",
  validateRequest(trackShipmentZod),
  shippoController.trackShipment
);

router.delete(
  "/:id",
  shippoController.deleteShipment
);

export const shippoRoutes = router;