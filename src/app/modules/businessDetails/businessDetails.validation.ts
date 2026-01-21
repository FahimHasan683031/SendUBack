import { z } from "zod";


export const addressSchema = z.object({
  street1: z.string().trim().optional(),
  street2: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  country: z.string().trim().optional(),
})



export const createBusinessDetailsSchema = z.object({
  body: z.object({
    businessName: z.string().trim().optional(),
    businessPhone: z.string().trim().optional(),
    businessEmail: z.string().toLowerCase().trim(),
    contactPerson: z.string().trim().optional(),
    managerName: z.string().trim().optional(),
    logo: z.string().url("Invalid logo URL").optional(),
    companyName: z.string().trim().min(1, "Company name is required").optional(),
    companyPhone: z.string().trim().min(1, "Company phone is required").optional(),
    companyScope: z.string().trim().optional(),
    taxOffice: z.string().trim().optional(),
    vatTaxNumber: z.string().trim().optional(),
    address: addressSchema.optional(),
    invoicingEmail: z.string().email("Invalid invoicing email").toLowerCase().trim().optional(),
  }).strict("Unknown fields are not allowed")
});

export const updateBusinessDetailsSchema = z.object({
  body: z.object({
    businessName: z.string().trim().optional(),
    businessPhone: z.string().optional(),
    businessEmail: z.string().optional(),
    contactPerson: z.string().trim().optional(),
    managerName: z.string().trim().optional(),
    logo: z.string().optional(),
    companyName: z.string().trim().optional(),
    companyPhone: z.string().trim().optional(),
    companyScope: z.string().trim().optional(),
    taxOffice: z.string().trim().optional(),
    vatTaxNumber: z.string().trim().optional(),
    address: addressSchema.optional(),
    invoicingEmail: z.string().toLowerCase().trim().optional(),
  }).strict("Unknown fields are not allowed")
});

export const completeProfileSchema = z.object({
  body: z.object({
    addressLine1: z.string().trim().min(1, "Address Line 1 is required"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(1, "City is required"),
    postcode: z.string().trim().min(1, "Postcode is required"),
    country: z.string().trim().min(1, "Country is required"),
    businessEmail: z.string().email("Invalid email").optional(), // Already set at signup, but can update?
    telephone: z.string().trim().optional(),
  })
});

export const BusinessDetailsValidations = {
  createBusinessDetailsSchema,
  updateBusinessDetailsSchema,
  completeProfileSchema
};