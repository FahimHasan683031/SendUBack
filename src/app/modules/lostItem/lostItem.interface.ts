import { Schema, model, Types, Document } from "mongoose";

export enum LOST_ITEM_STATUS {
  REGISTERED = "registered",
  LINKSENDED="linkSended",
  PAYMENTCOMPLETED="paymentCompleted",
  WITHCOURIER="withCourier",
  DELIVERED="delivered",
  COLLECTED="collected",
  
}

export interface ILostItemCurrentState{
  registered:boolean,
  linkSended:boolean,
  paymentCompleted:boolean,
  withCourier:boolean,
  delivered:boolean,
  collected:boolean,
}

export interface ILostItem extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  property: Types.ObjectId; 
  images?: string[];
  itemName: string;
  itemDescription?: string;
  dateFound: Date;
  locationFound: string;
  status: LOST_ITEM_STATUS;
  currentState:ILostItemCurrentState
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

