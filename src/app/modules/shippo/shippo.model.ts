// src/modules/shippo/shippo.model.ts
import { Schema, model } from "mongoose";

const ShippoShipmentSchema = new Schema({
  object_id: { type: String, required: true, unique: true },
  shipment_response: { type: Schema.Types.Mixed },
  transaction_response: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export const ShippoShipment = model("ShippoShipment", ShippoShipmentSchema);
