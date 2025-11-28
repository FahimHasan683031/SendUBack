import { Schema, model, Document } from 'mongoose';
import { IEasyPostAddress, IEasyPostParcel } from './easypost.interface';

export interface IEasyPostShipment extends Document {
  easypost_shipment_id: string;
  from_address: IEasyPostAddress;
  to_address: IEasyPostAddress;
  parcel: IEasyPostParcel;
  reference?: string;
  rates?: any[];
  selected_rate?: any;
  tracking_code?: string;
  postage_label?: string;
  status: 'created' | 'rated' | 'purchased' | 'delivered';
}

const addressSchema = new Schema({
  name: { type: String, required: true },
  street1: { type: String, required: true },
  street2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: String,
  email: String,
  company: String
});

const parcelSchema = new Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true }
});

const easypostShipmentSchema = new Schema({
  easypost_shipment_id: { type: String, required: true },
  from_address: addressSchema,
  to_address: addressSchema,
  parcel: parcelSchema,
  reference: String,
  rates: [Schema.Types.Mixed],
  selected_rate: Schema.Types.Mixed,
  tracking_code: String,
  postage_label: String,
  status: {
    type: String,
    enum: ['created', 'rated', 'purchased', 'delivered'],
    default: 'created'
  }
}, {
  timestamps: true
});

export const EasyPostShipment = model<IEasyPostShipment>('EasyPostShipment', easypostShipmentSchema);