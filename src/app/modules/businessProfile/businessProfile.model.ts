import { model, Schema } from "mongoose";
import { IBusinessProfile } from "./businessProfile.interface";

const businessProfileSchema = new Schema<IBusinessProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessName: {
      type: String,
      trim: true,
      required:false
    },
    businessPhone: {
      type: String,
      trim: true,
      required:false
    },
    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required:true
    },
    contactPerson: {
      type: String,
      trim: true,
      required:false
    },
    managerName: {
      type: String,
      trim: true,
      required:false
    },
    logo: {
      type: String
    },
    companyName: {
      type: String,
      trim: true,
      required:false
    },
    companyPhone: {
      type: String,
      trim: true,
      required:false
    },
    companyScope: {
      type: String,
      trim: true,
      required:false
    },
    taxOffice: {
      type: String,
      trim: true,
      required:false
    },
    vatTaxNumber: {
      type: String,
      trim: true,
      required:false
    },
    address: {
      type: String,
      trim: true,
      required:false
    },
    city: {
      type: String,
      trim: true,
      required:false
    },
    zipCode: {
      type: String,
      trim: true,
      required:false
    },
    country: {
      type: String,
      trim: true,
      required:false
    },
    invoicingEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required:false
    }
  },
  {
    timestamps: true
  }
);

export const BusinessProfile = model<IBusinessProfile>('BusinessProfile', businessProfileSchema);