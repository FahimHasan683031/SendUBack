import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, USER_ROLES, USER_STATUS, UserModel } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import config from "../../../config";



const UserSchema = new Schema(
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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "restricted", "deleted"],
      default: "active",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "business"],
      default: "business",
    },
    authentication: {
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
        default: "",
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
        enum: ['createAccount', 'resetPassword'],
      },
    },
  },
  {
    timestamps: true,
  }
);


// UserSchema.index({ email: 1, status: 1 });

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
) {
  return bcrypt.compare(givenPassword, savedPassword);
};


UserSchema.pre<IUser>("save", async function (next) {
  const email = this.email;
  if (email) {
    const isExist = await User.findOne({
      email: this.email,
      status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.RESTRICTED] },
    });
console.log(isExist)
    if (isExist) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "An account with this email already exists"
      );
    }
  }

  if (this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);


















