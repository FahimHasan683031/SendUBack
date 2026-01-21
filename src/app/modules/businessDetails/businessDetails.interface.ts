import { Types, Document } from "mongoose";



export interface IAddress {
  street1: string
  street2?: string
  city: string
  state: string
  postal_code: string
  country: string
  countryCode: string
}


// IBusinessDetails is now embedded in User, so no extends Document
export interface IBusinessDetails {
  businessName: string;

  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
  countryCode: string; // backend controlled

  businessEmail: string;
  telephone: string;

  completedAt: Date;
}

