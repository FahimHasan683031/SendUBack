import { Types, Document } from "mongoose";



export interface IAddress {
  street1: string
  street2?: string
  city: string
  state: string
  postal_code: string
  country: string
}


export interface IBusinessDetails extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  businessName?: string;
  businessPhone?: string;
  businessEmail: string;
  contactPerson?: string;
  managerName?: string;
  logo?: string;
  companyName?: string;
  companyPhone?: string;
  companyScope?: string;
  taxOffice?: string;
  vatTaxNumber?: string;
  address?: IAddress;
  invoicingEmail?: string;
}

