import { z } from "zod";


export const createZonePricingValidationSchema =z.object({
  body: z.object({
    title: z.string()
      .min(1, "Title is required")
      .max(100, "Title must be at most 100 characters"),
    fromZone: z.number(),
    toZone: z.number(),
    shippingType: z.enum(["standard", "express"], {
      errorMap: () => ({ message: "Shipping type must be 'standard' or 'express'" }),
    }),
    price: z.number().min(0, "Price must be a positive number"),
    duration: z.string().optional(),
    description: z.string().optional(),
  })
});

