import { Types } from 'mongoose';



export interface IZonePricing {
  _id: Types.ObjectId;
  title: string;
  fromZone: number;
  toZone: number;
  shippingType: "standard" | "express";
  price: number;
  duration?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingRateRequest {
  fromCountry: string;
  toCountry: string;
  shippingType: "standard" | "express";
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
  shippingType: "standard" | "express";
  price: number;
  duration?: string;
  estimatedDelivery?: string;
  totalCost?: number;
}