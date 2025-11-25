import { Schema, model, Document } from 'mongoose';
import { IShippingAddress, IParcel } from './shippo.interface';

export interface IShippoShipment extends Document {
  shippo_shipment_id: string;
  address_from: IShippingAddress;
  address_to: IShippingAddress;
  parcels: IParcel[];
  user_email?: string;
  user_phone?: string;
  rates: any[];
  selected_rate?: any;
  transaction_id?: string;
  tracking_number?: string;
  status: 'created' | 'rated' | 'purchased' | 'shipped' | 'delivered';
}

const shippingAddressSchema = new Schema({
  name: { type: String, required: true },
  street1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: String,
  email: String
});

const parcelSchema = new Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  distance_unit: { type: String, enum: ['in', 'cm'], required: true },
  weight: { type: Number, required: true },
  mass_unit: { type: String, enum: ['lb', 'kg'], required: true }
});

const shippoShipmentSchema = new Schema({
  shippo_shipment_id: { type: String, required: true },
  address_from: shippingAddressSchema,
  address_to: shippingAddressSchema,
  parcels: [parcelSchema],
  user_email: String,
  user_phone: String,
  rates: [Schema.Types.Mixed],
  selected_rate: Schema.Types.Mixed,
  transaction_id: String,
  tracking_number: String,
  status: {
    type: String,
    enum: ['created', 'rated', 'purchased', 'shipped', 'delivered'],
    default: 'created'
  }
}, {
  timestamps: true
});

export const ShippoShipment = model<IShippoShipment>('ShippoShipment', shippoShipmentSchema);