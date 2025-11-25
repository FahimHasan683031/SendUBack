import { z } from "zod";

// Base address validation
const baseAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// Base parcel validation
const baseParcelSchema = z.object({
  length: z.number().positive("Length must be positive"),
  width: z.number().positive("Width must be positive"),
  height: z.number().positive("Height must be positive"),
  distance_unit: z.enum(['in', 'cm'], {
    required_error: "Distance unit is required"
  }),
  weight: z.number().positive("Weight must be positive"),
  mass_unit: z.enum(['lb', 'kg'], {
    required_error: "Mass unit is required"
  }),
});

// Base shipment validation
const baseShipmentSchema = z.object({
  address_from: baseAddressSchema,
  address_to: baseAddressSchema,
  parcels: z.array(baseParcelSchema).min(1, "At least one parcel is required"),
  user_email: z.string().email().optional(),
  user_phone: z.string().optional(),
});

// Create shipment validation
export const createShipmentZod = z.object({
  body: baseShipmentSchema.strict(),
});

// Update shipment validation
export const updateShipmentZod = z.object({
  body: baseShipmentSchema.partial().strict(),
});

// Purchase label validation
export const purchaseLabelZod = z.object({
  body: z.object({
    rateId: z.string().min(1, "Rate ID is required"),
    shipmentId: z.string().min(1, "Shipment ID is required"),
  }).strict(),
});

// Get rates validation
export const getRatesZod = z.object({
  params: z.object({
    shipmentId: z.string().min(1, "Shipment ID is required"),
  }).strict(),
});

// Track shipment validation
export const trackShipmentZod = z.object({
  params: z.object({
    carrier: z.string().min(1, "Carrier is required"),
    trackingNumber: z.string().min(1, "Tracking number is required"),
  }).strict(),
});

// Validate address validation
export const validateAddressZod = z.object({
  body: baseAddressSchema.strict(),
});