import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpendSnapshot extends Document {
  campaignId: mongoose.Types.ObjectId;
  platform: "facebook" | "instagram" | "tiktok";
  spendAtPoll: number;
  rawInsights?: Record<string, any>;
  polledAt: Date;
}

const SpendSnapshotSchema = new Schema<ISpendSnapshot>(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", required: true, index: true },
    platform: { type: String, enum: ["facebook", "instagram", "tiktok"], required: true },
    spendAtPoll: { type: Number, required: true },
    rawInsights: { type: Schema.Types.Mixed },
    polledAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const SpendSnapshot: Model<ISpendSnapshot> =
  mongoose.models.SpendSnapshot ||
  mongoose.model<ISpendSnapshot>("SpendSnapshot", SpendSnapshotSchema);

export default SpendSnapshot;
