import { Types } from 'mongoose';

export type IPayment = {
  _id: Types.ObjectId;
  email: string;
  dateTime: Date;
  quoteId: Types.ObjectId;
  amount: number;
  transactionId: string;
  service: string;
  description?: string;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
};