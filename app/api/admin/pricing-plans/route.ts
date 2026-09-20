import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/db";
import PricingPlan from "@/models/PricingPlan";

export const dynamic = "force-dynamic";

const DEFAULT_PLANS = [
  {
    name: "Pay As You Go",
    code: "pay_as_you_go",
    monthlyFee: 0,
    feePercent: 5,
    spendThreshold: 0,
    description: "Standard 5% platform fee on all ad campaign spend. Free signup, no monthly subscription.",
    features: [
      "Access to Meta & TikTok Ads",
      "Mobile Money & Crypto Funding",
      "Automated Campaign Submission",
      "Standard Review & Analytics",
    ],
    isActive: true,
  },
  {
    name: "Growth",
    code: "growth",
    monthlyFee: 49,
    feePercent: 3,
    spendThreshold: 2000,
    description: "Reduced 3% platform fee tailored for scaling local e-commerce stores and startups.",
    features: [
      "Everything in Free tier",
      "Reduced 3% Management Fee",
      "Priority Review Queue (< 15 mins)",
      "Daily Automated Spend Audits",
      "WhatsApp & Priority Support",
    ],
    isActive: true,
  },
  {
    name: "Agency / Enterprise",
    code: "agency",
    monthlyFee: 199,
    feePercent: 1.5,
    spendThreshold: 10000,
    description: "Lowest 1.5% fee designed for marketing agencies managing multiple brands and client ad budgets.",
    features: [
      "Lowest 1.5% Management Fee",
      "Dedicated Ad Manager & Creative Review",
      "Multi-brand Account Segmentation",
      "Direct API Webhook Reporting",
      "Unlimited Daily Spend Capacity",
    ],
    isActive: true,
  },
];

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    await connectToDatabase();

    let plans = await PricingPlan.find({}).sort({ monthlyFee: 1 }).lean();

    // Auto-seed if collection is empty
    if (!plans || plans.length === 0) {
      await PricingPlan.insertMany(DEFAULT_PLANS);
      plans = await PricingPlan.find({}).sort({ monthlyFee: 1 }).lean();
    }

    return NextResponse.json({ plans });
  } catch (error: any) {
    console.error("Admin GET pricing-plans error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch pricing plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { name, code, monthlyFee, feePercent, spendThreshold, description, features, isActive } = body;

    if (!name || !code || feePercent === undefined) {
      return NextResponse.json(
        { error: "name, code, and feePercent are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const plan = await PricingPlan.findOneAndUpdate(
      { code: code.trim().toLowerCase() },
      {
        name: name.trim(),
        code: code.trim().toLowerCase(),
        monthlyFee: Number(monthlyFee) || 0,
        feePercent: Number(feePercent),
        spendThreshold: Number(spendThreshold) || 0,
        description: description || "",
        features: Array.isArray(features) ? features : [],
        isActive: isActive !== undefined ? isActive : true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Pricing plan saved successfully",
      plan,
    });
  } catch (error: any) {
    console.error("Admin POST pricing-plan error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save pricing plan" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { planId, feePercent, monthlyFee, isActive } = body;

    if (!planId) {
      return NextResponse.json({ error: "planId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updates: Record<string, any> = {};
    if (feePercent !== undefined) updates.feePercent = Number(feePercent);
    if (monthlyFee !== undefined) updates.monthlyFee = Number(monthlyFee);
    if (isActive !== undefined) updates.isActive = Boolean(isActive);

    const updatedPlan = await PricingPlan.findByIdAndUpdate(planId, updates, { new: true });

    if (!updatedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error: any) {
    console.error("Admin PATCH pricing-plan error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update pricing plan" },
      { status: 500 }
    );
  }
}
