import { z } from "zod";

// Base address validation
const baseAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
});

// Base parcel validation
const baseParcelSchema = z.object({
  length: z.number().positive("Length must be positive"),
  width: z.number().positive("Width must be positive"),
  height: z.number().positive("Height must be positive"),
  weight: z.number().positive("Weight must be positive"),
});

// Create shipment validation
export const createShipmentZod = z.object({
  body: z.object({
    from_address: baseAddressSchema,
    to_address: baseAddressSchema,
    parcel: baseParcelSchema,
    reference: z.string().optional(),
    carrier_accounts: z.array(z.string()).optional(),
  }).strict(),
});

// Purchase label validation
export const purchaseLabelZod = z.object({
  body: z.object({
    rateId: z.string().min(1, "Rate ID is required"),
    shipmentId: z.string().min(1, "Shipment ID is required"),
  }).strict(),
});

// Create pickup validation
export const createPickupZod = z.object({
  body: z.object({
    address: baseAddressSchema,
    shipment: z.string().min(1, "Shipment ID is required"),
    min_datetime: z.string().min(1, "Minimum datetime is required"),
    max_datetime: z.string().min(1, "Maximum datetime is required"),
    instructions: z.string().optional(),
    carrier_accounts: z.array(z.string()).optional(),
  }).strict(),
});

// Track shipment validation
export const trackShipmentZod = z.object({
  params: z.object({
    trackingCode: z.string().min(1, "Tracking code is required"),
  }).strict(),
});