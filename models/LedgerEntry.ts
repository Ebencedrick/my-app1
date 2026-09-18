import mongoose, { Schema, Document, Model } from "mongoose";

export type LedgerEntryType =
  | "deposit"
  | "hold"
  | "settlement"
  | "holdRelease"
  | "refund";

export interface ILedgerEntry extends Document {
  walletId: mongoose.Types.ObjectId;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  gateway?: "momo" | "crypto";
  gatewayRef?: string;
  campaignId?: mongoose.Types.ObjectId;
  status: "pending" | "completed" | "failed" | "cancelled";
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const LedgerEntrySchema = new Schema<ILedgerEntry>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true, index: true },
    type: {
      type: String,
      enum: ["deposit", "hold", "settlement", "holdRelease", "refund"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD", uppercase: true },
    gateway: { type: String, enum: ["momo", "crypto"] },
    gatewayRef: { type: String },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "completed",
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const LedgerEntry: Model<ILedgerEntry> =
  mongoose.models.LedgerEntry ||
  mongoose.model<ILedgerEntry>("LedgerEntry", LedgerEntrySchema);

export default LedgerEntry;
