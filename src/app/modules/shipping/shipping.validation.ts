// src/modules/shipping/shipping.validation.ts
import { z } from "zod";

// Address validation
const shippingAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
});

// Parcel validation
const parcelSchema = z.object({
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



// Base shipping validation
const baseShippingSchema = z.object({
  address_from: shippingAddressSchema,
  address_to: shippingAddressSchema,
  parcel: z.array(z.string().min(1, "Parcel is required")),
  notes: z.string().optional(),
});

// Create shipping validation
export const createShippingZod = z.object({
  body: baseShippingSchema.strict(),
});

// Update shipping validation
export const updateShippingZod = z.object({
  body: baseShippingSchema.partial().strict(),
});

// Update status validation
export const updateStatusZod = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  }).strict(),
});

// Add shipping label validation
export const addShippingLabelZod = z.object({
  body: z.object({
    shipping_label: z.string().min(1, "Shipping label is required")
  }).strict(),
});

// Add tracking info validation
export const addTrackingInfoZod = z.object({
  body: z.object({
    tracking_id: z.string().min(1, "Tracking ID is required"),
    tracking_url: z.string().url("Valid tracking URL is required"),
    carrier: z.string().min(1, "Carrier is required"),
  }).strict(),
});