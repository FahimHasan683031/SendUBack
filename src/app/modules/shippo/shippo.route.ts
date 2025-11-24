// src/modules/shippo/shippo.route.ts
import express from "express";
import { shippoControllers } from "./shippo.controller";




const router = express.Router();


router.post(
  "/address",
  shippoControllers.validateAddress
);


router.post(
  "/parcel",
  shippoControllers.createParcel
);


router.post(
  "/rates",
  shippoControllers.getRates
);


router.post(
  "/shipments",
  shippoControllers.createShipment
);


router.post("/transactions", shippoControllers.buyLabel);


router.get("/track/:carrier/:tracking_number", shippoControllers.trackShipment);

export const ShippoRoutes = router;
