import { z } from "zod";
import { USER_ROLES, USER_STATUS } from "./user.interface";

export const userSignupSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    businessName: z.string().min(1, "Business name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(USER_ROLES).default(USER_ROLES.BUSINESS),
  })
});

export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
  })
});

export const userUpdateSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").trim().toLowerCase().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    image: z.string().optional(),
    password: z.string().optional(),
    status: z.nativeEnum(USER_STATUS).optional(),
    verified: z.boolean().optional(),
    role: z.nativeEnum(USER_ROLES).optional(),

    // Business Details fields
    businessName: z.string().trim().optional(), // Added businessName as it is part of business details
    addressLine1: z.string().trim().optional(),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().optional(),
    postcode: z.string().trim().optional(),
    country: z.string().trim().optional(),
    businessEmail: z.string().email("Invalid email").optional(),
    telephone: z.string().trim().optional(),
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
});

export const UserValidations = {
  userSignupSchema,
  userLoginSchema,
  userUpdateSchema,
  changePasswordSchema,
};