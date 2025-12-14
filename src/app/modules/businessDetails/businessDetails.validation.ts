import { z } from "zod";


export const addressSchema = z.object({
  street1: z.string().trim().min(1, "Street 1 is required"),
  street2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postal_code: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
})



export const createBusinessDetailsSchema = z.object({
  body: z.object({
    businessName: z.string().trim().min(1, "Business name is required").optional(),
    businessPhone: z.string().trim().min(1, "Business phone is required").optional(),
    businessEmail: z.string().email("Invalid business email").toLowerCase().trim(),
    contactPerson: z.string().trim().min(1, "Contact person is required").optional(),
    managerName: z.string().trim().min(1, "Manager name is required").optional(),
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
    businessName: z.string().trim().min(1, "Business name is required").optional(),
    businessPhone: z.string().trim().min(1, "Business phone is required").optional(),
    businessEmail: z.string().email("Invalid business email").toLowerCase().trim().optional(),
    contactPerson: z.string().trim().min(1, "Contact person is required").optional(),
    managerName: z.string().trim().min(1, "Manager name is required").optional(),
    logo: z.string().optional(),
    companyName: z.string().trim().min(1, "Company name is required").optional(),
    companyPhone: z.string().trim().min(1, "Company phone is required").optional(),
    companyScope: z.string().trim().optional(),
    taxOffice: z.string().trim().optional(),
    vatTaxNumber: z.string().trim().optional(),
    address: addressSchema.optional(),
    invoicingEmail: z.string().email("Invalid invoicing email").toLowerCase().trim().optional(),
  }).strict("Unknown fields are not allowed")
});

export const BusinessDetailsValidations = {
  createBusinessDetailsSchema,
  updateBusinessDetailsSchema,
};