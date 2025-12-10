import { model, Schema } from "mongoose";
import { ILostItem, LOST_ITEM_STATUS } from "./lostItem.interface";

const lostItemSchema = new Schema<ILostItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(LOST_ITEM_STATUS),
      default: LOST_ITEM_STATUS.PENDING
    },
    images: [{
      type: String,
      trim: true,
      required:false
    }],
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    itemDescription: {
      type: String,
      trim: true
    },
    dateFound: {
      type: Date,
      required: true,
      default: Date.now
    },
    locationFound: {
      type: String,
      required: true,
      trim: true
    },
    guestName: {
      type: String,
      trim: true
    },
    guestEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    guestPhone: {
      type: String,
      trim: true
    },
    guestReservationName: {
      type: String,
      trim: true
    },
    guestRoomNumber: {
      type: String,
      trim: true
    },
    checkoutDate: {
      type: Date
    },
    note: {
      type: String,
      trim: true
    },
  },
  {
    timestamps: true
  }
);

export const LostItem = model<ILostItem>('LostItem', lostItemSchema);