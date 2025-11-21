import { Schema, model, Types, Document } from "mongoose";

export interface IBusinessProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  
  // Business Details
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  contactPerson: string;
  managerName?: string;
  logo?: string;
  
  // Address Details
  companyName?: string;
  companyPhone?: string;
  companyScope?: string;
  taxOffice?: string;
  vatTaxNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  invoicingEmail?: string;
  
}

