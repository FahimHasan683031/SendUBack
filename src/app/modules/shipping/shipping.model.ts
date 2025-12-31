import { Schema, model } from 'mongoose'
import { IShipping } from './shipping.interface'

const shippingAddressSchema = new Schema({
  placeName: String,
  businessName: String,
  street1: { type: String, required: true },
  street2: String,
  city: { type: String, required: true },
  state: String,
  postal_code: String,
  country: { type: String, required: true },
  phone: String,
  email: { type: String, required: true },
  countryName: { type: String, required: true },
})

const parcelSchema = new Schema({
  itemType: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  distance_unit: { type: String, enum: ['in', 'cm'], required: true },
  weight: { type: Number, required: true },
  mass_unit: { type: String, enum: ['lb', 'kg'], required: true },
})

const insuranceSchema = new Schema(
  {
    isInsured: { type: Boolean, required: true, default: false },
    productValue: { type: Number, min: 0 },
    insuranceCost: { type: Number, min: 0 },
  },
  { _id: false },
)

const shippingSchema = new Schema<IShipping>(
  {
    zoneName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'created',
        'paymentCompleted',
        'shipped',
        'delivered',
      ],
      default: 'created',
    },
    address_from: { type: shippingAddressSchema, required: true },
    address_to: { type: shippingAddressSchema, required: true },
    parcel: [parcelSchema],
    selected_rate: { type: Schema.Types.ObjectId, ref: 'ZonePricing' },
    shipping_cost: { type: Number, min: 0 },
    insurance: { type: insuranceSchema },
    total_cost: { type: Number, default: 0 },
    shippingLabel: String,
    tracking_id: String,
    tracking_url: String,
    carrier: String,
    lostItemId: { type: Schema.Types.ObjectId, ref: 'LostItem' },
    notes: String,
  },
  {
    timestamps: true,
  },
)

shippingSchema.index({ tracking_id: 1 })
shippingSchema.index({ status: 1 })
shippingSchema.index({ shipping_type: 1 })

export const Shipping = model<IShipping>('Shipping', shippingSchema)
