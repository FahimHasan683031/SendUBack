import { z } from "zod";

export const createLostItemSchema = z.object({
  body: z.object({
    images: z.array(z.string()).optional(),
    itemName: z.string().trim().min(1, "Item name is required"),
    itemDescription: z.string().trim().optional(),
    dateFound: z.string().datetime("Invalid date format").or(z.date()).optional(),
    locationFound: z.string().trim().min(1, "Location found is required"),
    guestName: z.string().trim().optional(),
    guestEmail: z.string().email("Invalid guest email").toLowerCase().trim().optional(),
    guestPhone: z.string().trim().optional(),
    guestReservationName: z.string().trim().optional(),
    property: z.string().trim(),
    guestRoomNumber: z.string().trim().optional(),
    checkoutDate: z.string().datetime("Invalid checkout date format").or(z.date()).optional(),
    note: z.string().trim().optional(),
  }).strict("Unknown fields are not allowed")
});

export const updateLostItemSchema = z.object({
  body: z.object({
    images: z.array(z.string()).optional(),
    itemName: z.string().trim().min(1, "Item name is required").optional(),
    itemDescription: z.string().trim().optional(),
    dateFound: z.string().datetime("Invalid date format").or(z.date()).optional(),
    locationFound: z.string().trim().min(1, "Location found is required").optional(),
    guestName: z.string().trim().optional(),
    guestEmail: z.string().email("Invalid guest email").toLowerCase().trim().optional(),
    guestPhone: z.string().trim().optional(),
    property: z.string().trim().optional(),
    guestReservationName: z.string().trim().optional(),
    guestRoomNumber: z.string().trim().optional(),
    checkoutDate: z.string().datetime("Invalid checkout date format").or(z.date()).optional(),
    note: z.string().trim().optional(),
  }).strict("Unknown fields are not allowed")
});

export const addOrReplaceImagesSchema = z.object({
  body: z.object({
    images: z.array(z.string()).min(1, "At least one image path is required"),
  }).strict("Unknown fields are not allowed")
});

export const sendGuestEmailSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").optional(),
  }).strict("Unknown fields are not allowed")
});

export const LostItemValidations = {
  createLostItemSchema,
  updateLostItemSchema,
  addOrReplaceImagesSchema,
  sendGuestEmailSchema
};