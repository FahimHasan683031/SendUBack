import { z } from "zod";
import { Zones } from "../../../utils/zone.utils";


const zoneIds = Zones.map(zone => zone.id);

// create zone pricing validation schema
export const createZonePricingValidationSchema = z.object({
  body: z.object({
    fromZone: z.number()
      .min(1, "From zone must be between 1 and 6")
      .max(6, "From zone must be between 1 and 6")
      .refine(val => zoneIds.includes(val), {
        message: "Invalid from zone ID",
      }),
    toZone: z.number()
      .min(1, "To zone must be between 1 and 6")
      .max(6, "To zone must be between 1 and 6")
      .refine(val => zoneIds.includes(val), {
        message: "Invalid to zone ID",
      }),
    shippingType: z.enum(["standard", "express"], {
      errorMap: () => ({ message: "Shipping type must be 'standard' or 'express'" }),
    }),
    price: z.number().min(0, "Price must be a positive number"),
    duration: z.string().optional(),
    description: z.string().optional(),
  }).refine(data => data.fromZone !== data.toZone, {
    message: "From zone and to zone cannot be the same",
    path: ["toZone"],
  }),
});

// update zone pricing validation schema
export const updateZonePricingValidationSchema = z.object({
  body: z.object({
    fromZone: z.number()
      .min(1)
      .max(6)
      .refine(val => zoneIds.includes(val), {
        message: "Invalid from zone ID",
      })
      .optional(),
    toZone: z.number()
      .min(1)
      .max(6)
      .refine(val => zoneIds.includes(val), {
        message: "Invalid to zone ID",
      })
      .optional(),
    shippingType: z.enum(["standard", "express"]).optional(),
    price: z.number().min(0).optional(),
    duration: z.string().optional(),
    description: z.string().optional(),
  }).refine(data => !data.fromZone || !data.toZone || data.fromZone !== data.toZone, {
    message: "From zone and to zone cannot be the same",
    path: ["toZone"],
  }),
});

// calculate shipping rate validation schema
export const calculateShippingRateValidationSchema = z.object({
  body: z.object({
    fromCountry: z.string()
      .length(2, "Country code must be 2 characters")
      .toUpperCase(),
    toCountry: z.string()
      .length(2, "Country code must be 2 characters")
      .toUpperCase(),
    shippingType: z.enum(["standard", "express"], {
      errorMap: () => ({ message: "Shipping type must be 'standard' or 'express'" }),
    }),
    weight: z.number().min(0).optional(),
    dimensions: z.object({
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
    }).optional(),
  }),
});