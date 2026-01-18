import { z } from 'zod'

const createPropertyZod = z.object({
    body: z.object({
        propertyName: z.string({
            required_error: 'Property name is required',
        }).min(1, 'Property name cannot be empty'),

        propertyType: z.string({
            required_error: 'Property type is required',
        }).min(1, 'Property type cannot be empty'),

        propertyImage: z.array(z.string()).optional(),

        addressLine1: z.string({
            required_error: 'Address line 1 is required',
        }).min(1, 'Address line 1 cannot be empty'),

        addressLine2: z.string().optional(),

        city: z.string({
            required_error: 'City is required',
        }).min(1, 'City cannot be empty'),

        postcode: z.string().optional(),

        country: z.string({
            required_error: 'Country is required',
        }).min(1, 'Country cannot be empty'),

        contactEmail: z.string({
            required_error: 'Contact email is required',
        }).email('Invalid email format'),

        contactPhone: z.string({
            required_error: 'Contact phone is required',
        }).min(1, 'Contact phone cannot be empty'),

        website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    }),
})

const updatePropertyZod = z.object({
    body: z.object({
        propertyName: z.string().min(1, 'Property name cannot be empty').optional(),
        propertyType: z.string().min(1, 'Property type cannot be empty').optional(),
        propertyImage: z.array(z.string()).optional(),
        addressLine1: z.string().min(1, 'Address line 1 cannot be empty').optional(),
        addressLine2: z.string().optional(),
        city: z.string().min(1, 'City cannot be empty').optional(),
        postcode: z.string().optional(),
        country: z.string().min(1, 'Country cannot be empty').optional(),
        contactEmail: z.string().email('Invalid email format').optional(),
        contactPhone: z.string().min(1, 'Contact phone cannot be empty').optional(),
        website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    }),
})

export const PropertyValidations = {
    createPropertyZod,
    updatePropertyZod,
}
