import { z } from "zod";

// Address validation
const shippingAddressSchema = z.object({
  hotelName: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required").optional(),
  postal_code: z.string().min(1, "Postal code is required").optional(),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
});


// Insurance validation
const insuranceSchema = z.object({
  isInsured: z.boolean({
    required_error: "Insurance selection is required"
  }),
  productValue: z.number().positive("Product value must be positive").min(10, "Product value must be at least 10"),
})

// Base shipping validation
const baseShippingSchema = z.object({
  address_from: shippingAddressSchema,
  address_to: shippingAddressSchema,
  parcel: z.array(z.string().min(1, "Parcel is required")),
  selected_rate: z.any().optional(),
  insurance: insuranceSchema.optional(),
  notes: z.string().optional(),
  lostItemId: z.string().optional()
});

// Create shipping validation
export const createShippingZod = z.object({
  body: baseShippingSchema.strict(),
});

// Update shipping validation
export const updateShippingZod = z.object({
  body: baseShippingSchema.partial().strict(),
});



// Add tracking info validation
export const addShippingInfo = z.object({
  body: z.object({
    shippingLabel: z.string().min(1, "Shipping label is required"),
    tracking_id: z.string().min(1, "Tracking ID is required"),
    tracking_url: z.string().url("Valid tracking URL is required").optional(),
    carrier: z.string().min(1, "Carrier is required").optional(),
  }).strict(),
});

// Calculate shipping rates validation
export const calculateShippingRatesZod = z.object({
  body: z.object({
    shipping_type: z.enum(['insideUk', 'international']),
    address_from: shippingAddressSchema,
    address_to: shippingAddressSchema,
    parcel: z.array(z.string().min(1, "Parcel is required")),
  }).strict(),
});

// Calculate insurance validation
export const calculateInsuranceZod = z.object({
  body: z.object({
    productValue: z.number().positive("Product value must be positive"),
  }).strict(),
});