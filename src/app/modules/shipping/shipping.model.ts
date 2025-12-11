import { Schema, model } from 'mongoose';
import { IShipping } from './shipping.interface';


const shippingAddressSchema = new Schema({
  hotelName: String,
  name: { type: String, required: true },
  street1: { type: String, required: true },
  street2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

const parcelSchema = new Schema({
  name: { type: String, required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  distance_unit: { type: String, enum: ['in', 'cm'], required: true },
  weight: { type: Number, required: true },
  mass_unit: { type: String, enum: ['lb', 'kg'], required: true }
});

const insuranceSchema = new Schema({
  isInsured: { type: Boolean, required: true, default: false },
  productValue: { type: Number, min: 0 },
  insuranceCost: { type: Number, min: 0 }
}, { _id: false });

const shippingSchema = new Schema<IShipping>({
  shipping_type: {
    type: String,
    enum: ['insideUk', 'international',"Europe Near","Europe Far","North America","Middle East & Asia","Australia / Africa / Rest of World"],
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'rateSelected', 'paymentCompleted', 'shipped', 'delivered'],
    default: 'created'
  },
  address_from: { type: shippingAddressSchema, required: true },
  address_to: { type: shippingAddressSchema, required: true },
  parcel: [parcelSchema],
  selected_rate: { type: Schema.Types.ObjectId, ref: 'ZonePricing' },
  shipping_cost: { type: Number, min: 0 },
  currency: { type: String, default: 'GBP' },
  insurance: { type: insuranceSchema },
  total_cost: { type: Number, default: 0 },
  shippingLabel: String,
  tracking_id: String,
  tracking_url: String,
  carrier: String,
  lostItemId: { type: Schema.Types.ObjectId, ref: 'LostItem' },
  notes: String
}, {
  timestamps: true
});

shippingSchema.index({ tracking_id: 1 });
shippingSchema.index({ status: 1 });
shippingSchema.index({ shipping_type: 1 });

export const Shipping = model<IShipping>('Shipping', shippingSchema);
