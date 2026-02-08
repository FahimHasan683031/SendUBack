import { z } from "zod";

// Address validation
const shippingAddressSchema = z.object({
  businessName: z.string().optional(),
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  countryName: z.string().min(1, "Country name is required"),
  phone: z.string().optional(),
  email: z.string().optional(),
});


// Insurance validation
const insuranceSchema = z.object({
  isInsured: z.boolean({
    required_error: "Insurance selection is required"
  }),
  productValue: z.number().optional(),
})

// Base shipping validation
const baseShippingSchema = z.object({
  address_from: shippingAddressSchema,
  address_to: shippingAddressSchema,
  parcel: z.array(z.object({
    itemType: z.string().min(1, "Item type is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional()
  })).min(1, "At least one parcel is required"),
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
    shippingLabel: z.string().optional(),
    tracking_id: z.string().optional(),
    tracking_url: z.string().optional(),
    carrier: z.string().optional(),
  }).strict(),
});

// Calculate shipping rates validation
export const calculateShippingRatesZod = z.object({
  body: z.object({
    shipping_type: z.enum(['insideUk', 'international']),
    address_from: shippingAddressSchema,
    address_to: shippingAddressSchema,
    parcel: z.array(z.object({
      itemType: z.string().min(1, "Item type is required"),
      name: z.string().min(1, "Name is required"),
      description: z.string().optional()
    })).min(1, "At least one parcel is required"),
  }).strict(),
});

// Calculate insurance validation
export const calculateInsuranceZod = z.object({
  body: z.object({
    productValue: z.number().positive("Product value must be positive"),
  }).strict(),
});