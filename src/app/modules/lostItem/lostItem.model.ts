import { model, Schema } from "mongoose";
import { ILostItem, LOST_ITEM_STATUS } from "./lostItem.interface";

const lostItemSchema = new Schema<ILostItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(LOST_ITEM_STATUS),
      default: LOST_ITEM_STATUS.REGISTERED
    },
    currentState: {
      registered: { type: Boolean, default: true },
      linkSended: { type: Boolean, default: false },
      paymentCompleted: { type: Boolean, default: false },
      withCourier: { type: Boolean, default: false },
      delivered: { type: Boolean, default: false },
      collected: { type: Boolean, default: false },
    },
    images: [{
      type: String,
      trim: true,
      required: false
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
  },
  {
    timestamps: true
  }
);

export const LostItem = model<ILostItem>('LostItem', lostItemSchema);