import { model, Schema } from "mongoose";
import { IZonePricing } from "./zonePricing.interface";

const ZonePricingSchema = new Schema<IZonePricing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    fromZone: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    toZone: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    shippingType: {
      type: String,
      required: true,
      enum: ["standard", "express"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
      trim: true,
      default: "5-10 business days",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound unique index
ZonePricingSchema.index(
  { fromZone: 1, toZone: 1, shippingType: 1 }, 
  { unique: true }
);

// Index for better query performance
ZonePricingSchema.index({ status: 1 });
ZonePricingSchema.index({ price: 1 });

export const ZonePricing = model<IZonePricing>('ZonePricing', ZonePricingSchema);