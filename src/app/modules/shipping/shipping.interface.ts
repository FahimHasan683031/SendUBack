import { Types } from "mongoose";
export type ShippingType = 'insideUk' | 'international';
export type ShippingStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IShippingAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
}

export interface IParcel {
  length: number
  width: number
  height: number
  distance_unit: 'in' | 'cm'
  weight: number
  mass_unit: 'lb' | 'kg'
}


export interface IShipping {
  _id: Types.ObjectId;
  shipping_type: ShippingType;
  status: ShippingStatus;
  
  // Address information
  address_from: IShippingAddress;
  address_to: IShippingAddress;
  
  // Package information
  parcel: IParcel[] | string[];
  price?:number;
  insurance?:number;
  // Shipping details
  shipping_label?: string; 
  tracking_id?: string;
  tracking_url?: string;
  carrier?: string;
  service?: string;
  shipping_cost?: number;
  currency: string;
  notes?: string;
}