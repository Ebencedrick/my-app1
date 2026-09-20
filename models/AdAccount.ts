import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdAccount extends Document {
  name: string;
  platform: "meta" | "tiktok" | "instagram" | "linkedin";
  accountId: string;
  status: "healthy" | "needs_attention" | "paused";
  spendCapacity: number;
  dailySpend: number;
  dailySpendLimit: number;
  healthScore: number;
  paymentMethodStatus: string;
  currency: string;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdAccountSchema = new Schema<IAdAccount>(
  {
    name: { type: String, required: true },
    platform: {
      type: String,
      enum: ["meta", "tiktok", "instagram", "linkedin"],
      required: true,
    },
    accountId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["healthy", "needs_attention", "paused"],
      default: "healthy",
    },
    spendCapacity: { type: Number, default: 25000 },
    dailySpend: { type: Number, default: 0 },
    dailySpendLimit: { type: Number, default: 5000 },
    healthScore: { type: Number, default: 95 },
    paymentMethodStatus: { type: String, default: "Active (Mastercard •••• 4242)" },
    currency: { type: String, default: "USD" },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AdAccount: Model<IAdAccount> =
  mongoose.models.AdAccount ||
  mongoose.model<IAdAccount>("AdAccount", AdAccountSchema);

export default AdAccount;
