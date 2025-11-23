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
  userId: Types.ObjectId; 
  images?: string[];
  qrCode?: string;
  itemName: string;
  itemDescription?: string;
  dateFound: Date;
  locationFound: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestReservationName?: string;
  guestRoomNumber?: string;
  checkoutDate?: Date;
  note?: string;
}

