import * as mongoose from 'mongoose';

export const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface Otp extends mongoose.Document {
  email: string;
  otp: number;
  createdAt: Date;
}
