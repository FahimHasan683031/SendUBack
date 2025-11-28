import { z } from "zod";

export const baseAddressSchema = z.object({
  address_type: z.enum([
    'hotel',
    'airport',
    'car_rental',
    'ship',
    'airbnb',
    'hospital',
    'travel_agency',
    'event',
    'museum',
    'bus',
    'lost_property',
    'other',
    'to'
  ], { errorMap: () => ({ message: "Invalid address type" }) }),

  name: z.string().min(1, "Name is required"),
  street1: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zip: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),

  room_number: z.string().optional(),
  reservation_name: z.string().optional(),
  check_out_date: z.string().optional(),
  airport_section: z.string().optional(),
  location_description: z.string().optional(),
  pickup_location: z.string().optional(),
  reference_code: z.string().optional(),
  trip_date: z.string().optional(),
  trip_from: z.string().optional(),
  trip_to: z.string().optional(),
  booking_reference: z.string().optional(),
  seat_number: z.string().optional(),
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
  description: z.string().optional(),
});

// Base shipment validation
const baseShipmentSchema = z.object({
  address_from: baseAddressSchema,
  address_to: baseAddressSchema,
  products: z.array(z.string().min(1, "Product description is required")),
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

// Select rate validation
export const selectRateZod = z.object({
  body: z.object({
    shipmentId: z.string().min(1, "Shipment ID is required"),
    rateId: z.string().min(1, "Rate ID is required"),
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