import { model, Schema } from "mongoose";
import { IAddress, IBusinessDetails } from "./businessDetails.interface";


const addressSchema = new Schema<IAddress>({
  street1: {
    type: String,
    trim: true,
    required: true
  },
  street2: {
    type: String,
    trim: true,
    required: false
  },
  city: {
    type: String,
    trim: true,
    required: true
  },
  state: {
    type: String,
    trim: true,
    required: true
  },
  postal_code: {
    type: String,
    trim: true,
    required: true
  },
  country: {
    type: String,
    trim: true,
    required: true
  },
  countryCode: {
    type: String,
    trim: true,
    required: true
  }
},{
    _id: false
  })

const businessDetailsSchema = new Schema<IBusinessDetails>(
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
      type: String,
      required:false
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
    address: addressSchema,
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

export const BusinessDetails = model<IBusinessDetails>('BusinessDetails', businessDetailsSchema);