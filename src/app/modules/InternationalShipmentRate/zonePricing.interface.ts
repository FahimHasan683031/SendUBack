import { Types } from 'mongoose';
import { ShippingType } from '../../../utils/zone.utils';


export interface IZonePricing {
  _id: Types.ObjectId;
  fromZone: number;
  toZone: number;
  shippingType: ShippingType;
  price: number;
  duration?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingRateRequest {
  fromCountry: string;
  toCountry: string;
  shippingType: ShippingType;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface IShippingRateResponse {
  fromZone: number;
  toZone: number;
  shippingType: ShippingType;
  price: number;
  duration?: string;
  estimatedDelivery?: string;
  totalCost?: number;
}