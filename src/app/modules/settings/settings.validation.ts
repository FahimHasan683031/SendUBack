import { z } from "zod";

export const SettingsValidation = z.object({
    body: z.object({
        insurance: z.object({
            percentage: z.number().min(1, "Insurance percentage is required"),
            maxValue: z.number().min(1, "Insurance max value is required"),
        }),
        profitMargin: z.number().min(0, "Profit margin must be non-negative").optional(),
        allowCountrys: z.array(z.string().min(1, "Country is required")).optional(),
    }).strict(),
})

