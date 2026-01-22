import { Model, Types } from "mongoose";
import { USER_ROLES, USER_STATUS } from "../../../enum/user";

export { USER_ROLES, USER_STATUS };


/* ================= AUTH ================= */

export type IAuthentication = {
  restrictionLeftAt: Date | null;
  resetPassword: boolean;
  wrongLoginAttempts: number;
  passwordChangedAt?: Date;
  oneTimeCode?: string;
  latestRequestAt?: Date;
  expiresAt?: Date;
  requestCount?: number;
  authType?: "createAccount" | "resetPassword";
};

/* ================= BUSINESS DETAILS ================= */

export type IBusinessDetails = {
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
};

/* ================= USER ================= */

export type IUser = {
  _id: Types.ObjectId;

  email: string;
  password: string;

  firstName?: string; // Admin
  lastName?: string;  // Admin

  image?: string;

  role: USER_ROLES;
  status: USER_STATUS;
  verified: boolean;

  businessDetailsCompleted: boolean;
  businessDetails?: IBusinessDetails;

  authentication: IAuthentication;

  createdAt: Date;
  updatedAt: Date;
};



export type UserModel = {
  isPasswordMatched: (givenPassword: string, savedPassword: string) => Promise<boolean>;
} & Model<IUser>;