import { Model, Types } from "mongoose";

export enum USER_ROLES {
  ADMIN = "admin",
  Business = "business"
}

export enum USER_STATUS {
  ACTIVE = "active",
  RESTRICTED = "restricted",
  DELETED = "deleted",
}

type IAuthentication = {
  restrictionLeftAt: Date | null
  resetPassword: boolean
  wrongLoginAttempts: number
  passwordChangedAt?: Date
  oneTimeCode: string
  latestRequestAt: Date
  expiresAt?: Date
  requestCount?: number
  authType?: 'createAccount' | 'resetPassword'
}

export type IUser = {
  _id: Types.ObjectId;
  email: string;
  image?: string;
  password: string;
  firstName: string;
  lastName: string;
  status: USER_STATUS;
  verified: boolean;
  role: USER_ROLES;
  authentication: IAuthentication;
};



export type UserModel = {
  isPasswordMatched: (givenPassword: string, savedPassword: string) => Promise<boolean>;
} & Model<IUser>;