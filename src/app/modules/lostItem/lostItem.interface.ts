import { Schema, model, Types, Document } from "mongoose";

export enum LOST_ITEM_STATUS {
  PENDING = "pending",
  SHIPMENT_BOOKED = "Shipment Booked",
}

export interface ILostItem extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; 
  images?: string[];
  itemName: string;
  itemDescription?: string;
  dateFound: Date;
  locationFound: string;
  status: LOST_ITEM_STATUS;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  guestReservationName?: string;
  guestRoomNumber?: string;
  checkoutDate?: Date;
  note?: string;
}

