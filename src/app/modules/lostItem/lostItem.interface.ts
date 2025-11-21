import { Schema, model, Types, Document } from "mongoose";

export enum LOST_ITEM_STATUS {
  PENDING = "pending",
  FOUND = "found",
  RETURNED = "returned",
  CLAIMED = "claimed",
  DISCARDED = "discarded"
}

export interface ILostItem extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Business user who added the item
  businessId: Types.ObjectId; // Business profile reference
  
  // Item Images
  images: string[];
  
  // QR Code
  qrCode?: string;
  
  // Item Details
  itemName: string;
  itemDescription?: string;
  dateFound: Date;
  locationFound: string;
  
  // Guest Details
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestReservationName?: string;
  guestRoomNumber?: string;
  checkoutDate?: Date;
  
  // Additional Info
  note?: string;
  
  // Status
  status: LOST_ITEM_STATUS;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

