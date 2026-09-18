import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricingPlan extends Document {
  name: string;
  code: string;
  monthlyFee: number;
  feePercent: number; // e.g. 5 for 5%
  spendThreshold?: number;
  description?: string;
  features?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    monthlyFee: { type: Number, default: 0 },
    feePercent: { type: Number, default: 5 }, // 5% default
    spendThreshold: { type: Number },
    description: { type: String },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PricingPlan: Model<IPricingPlan> =
  mongoose.models.PricingPlan ||
  mongoose.model<IPricingPlan>("PricingPlan", PricingPlanSchema);

export default PricingPlan;
