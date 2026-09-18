import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdSet {
  platform: "facebook" | "instagram" | "tiktok";
  targeting: {
    location?: string;
    ageRange?: { min: number; max: number };
    gender?: string;
    interests?: string[];
    [key: string]: any;
  };
  externalId?: string;
}

export interface ICreative {
  mediaUrl?: string;
  mediaType?: "image" | "video";
  copyText?: string;
  ctaType?: string;
  externalId?: string;
}

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  objective: string;
  platforms: string[];
  status:
    | "draft"
    | "pending"
    | "in_review"
    | "active"
    | "paused"
    | "completed"
    | "rejected";
  dailyBudget: number;
  days: number;
  totalAdSpend: number;
  managementFee: number;
  totalCharge: number;
  startDate?: Date;
  endDate?: Date;
  metaCampaignId?: string;
  tiktokCampaignId?: string;
  adSets: IAdSet[];
  creative: ICreative;
  createdAt: Date;
  updatedAt: Date;
}

const AdSetSchema = new Schema<IAdSet>(
  {
    platform: { type: String, enum: ["facebook", "instagram", "tiktok"], required: true },
    targeting: { type: Schema.Types.Mixed, default: {} },
    externalId: { type: String },
  },
  { _id: false }
);

const CreativeSchema = new Schema<ICreative>(
  {
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    copyText: { type: String },
    ctaType: { type: String },
    externalId: { type: String },
  },
  { _id: false }
);

const CampaignSchema = new Schema<ICampaign>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    objective: { type: String, required: true },
    platforms: [{ type: String }],
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "in_review",
        "active",
        "paused",
        "completed",
        "rejected",
      ],
      default: "pending",
      index: true,
    },
    dailyBudget: { type: Number, required: true },
    days: { type: Number, required: true },
    totalAdSpend: { type: Number, required: true },
    managementFee: { type: Number, required: true },
    totalCharge: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    metaCampaignId: { type: String },
    tiktokCampaignId: { type: String },
    adSets: [AdSetSchema],
    creative: { type: CreativeSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
