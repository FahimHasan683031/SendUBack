import { Types, Document } from "mongoose";

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
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  invoicingEmail?: string;
}

