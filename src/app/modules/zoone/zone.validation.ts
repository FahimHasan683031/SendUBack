import { z } from 'zod';

// Helper schema for country code
const countryCodeSchema = z
  .string()
  .length(2, 'Country code must be 2 letters')
  .toUpperCase()
  .regex(/^[A-Z]+$/, 'Country code must contain only letters');

// CREATE zone validation
export const createZoneZod = z.object({
  body: z.object({
    name: z.string().min(1, 'Zone name is required'),
    countries: z.array(countryCodeSchema).min(1, 'At least one country required'),
  }),
});

// UPDATE zone validation
export const updateZoneZod = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    countries: z.array(countryCodeSchema).optional(),
    isActive: z.boolean().optional(),
  }),
});