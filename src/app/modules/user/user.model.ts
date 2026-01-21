import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, USER_ROLES, USER_STATUS, UserModel } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";




const BusinessDetailsSchema = new Schema(
  {
    businessName: { type: String, required: true },
    addressLine1: { type: String, required: false },
    addressLine2: { type: String },
    city: { type: String, required: false },
    postcode: { type: String, required: false },
    country: { type: String, required: false },
    countryCode: { type: String, required: false },
    businessEmail: { type: String, required: false },
    telephone: { type: String, required: false },
    completedAt: { type: Date, required: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.PENDING,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.BUSINESS,
    },
    businessDetailsCompleted: {
      type: Boolean,
      default: false,
    },
    businessDetails: {
      type: BusinessDetailsSchema,
      default: null,
    },
    authentication: {
      type: {
        restrictionLeftAt: {
          type: Date,
          default: null,
        },
        resetPassword: {
          type: Boolean,
          default: false,
        },
        wrongLoginAttempts: {
          type: Number,
          default: 0,
        },
        passwordChangedAt: Date,
        oneTimeCode: {
          type: String,
          default: null,
        },
        latestRequestAt: {
          type: Date,
          default: Date.now,
        },
        expiresAt: Date,
        requestCount: {
          type: Number,
          default: 0,
        },
        authType: {
          type: String,
          enum: ["createAccount", "resetPassword"],
        },
      },
      select: false,
    },
  },
  {
    timestamps: true,
  }
);


UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
) {
  return bcrypt.compare(givenPassword, savedPassword);
};


UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("email")) {
      const isExist = await User.findOne({
        email: this.email,
        status: { $in: [USER_STATUS.PENDING, USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
        _id: { $ne: this._id },
      });

      if (isExist) {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "An account with this email already exists"
          )
        );
      }
    }
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
      );
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});


export const User = mongoose.model<IUser, UserModel>("User", UserSchema);



















