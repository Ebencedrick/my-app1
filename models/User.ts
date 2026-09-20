import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  phone?: string;
  businessName?: string;
  industry?: string;
  website?: string;
  campaignGoal?: string;
  audience?: string;
  budget?: string;
  platformFocus?: string[];
  role: "user" | "admin";
  planId?: string;
  themePreference?: string;
  kycStatus: "unverified" | "pending" | "verified" | "rejected";
  kycDocumentName?: string;
  phoneVerified: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, trim: true },
    businessName: { type: String, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    campaignGoal: { type: String, trim: true },
    audience: { type: String, trim: true },
    budget: { type: String, trim: true },
    platformFocus: [{ type: String, trim: true }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    planId: { type: String, default: "pay_as_you_go" },
    themePreference: { type: String, default: "sunset" },
    kycStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    kycDocumentName: { type: String, trim: true },
    phoneVerified: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
