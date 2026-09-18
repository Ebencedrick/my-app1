import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeposit extends Document {
  userId: mongoose.Types.ObjectId;
  method: "momo" | "crypto";
  amount: number; // In internal currency (USD)
  currency: string;
  originalCurrency: string; // e.g. XAF, BTC, USDT
  originalAmount: number;
  fxRateUsed?: number;
  gatewayRef?: string;
  status: "pending" | "confirmed" | "failed" | "expired";
  confirmedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DepositSchema = new Schema<IDeposit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    method: { type: String, enum: ["momo", "crypto"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD", uppercase: true },
    originalCurrency: { type: String, required: true },
    originalAmount: { type: Number, required: true },
    fxRateUsed: { type: Number },
    gatewayRef: { type: String, index: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "expired"],
      default: "pending",
    },
    confirmedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Deposit: Model<IDeposit> =
  mongoose.models.Deposit || mongoose.model<IDeposit>("Deposit", DepositSchema);

export default Deposit;
