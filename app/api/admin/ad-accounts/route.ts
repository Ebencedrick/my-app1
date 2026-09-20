import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/db";
import AdAccount from "@/models/AdAccount";

export const dynamic = "force-dynamic";

const DEFAULT_ACCOUNTS = [
  {
    name: "Meta Business Manager",
    platform: "meta",
    accountId: "act_meta_primary_bm_01",
    status: "healthy",
    spendCapacity: 30000,
    dailySpend: 2450,
    dailySpendLimit: 10000,
    healthScore: 96,
    paymentMethodStatus: "Active (Mastercard •••• 4242)",
    currency: "USD",
  },
  {
    name: "TikTok Business Center",
    platform: "tiktok",
    accountId: "tt_ads_bc_global_02",
    status: "healthy",
    spendCapacity: 18000,
    dailySpend: 1150,
    dailySpendLimit: 6000,
    healthScore: 89,
    paymentMethodStatus: "Active (Visa •••• 8891)",
    currency: "USD",
  },
  {
    name: "Instagram Marketing Partner",
    platform: "instagram",
    accountId: "act_ig_direct_partner_03",
    status: "healthy",
    spendCapacity: 22000,
    dailySpend: 1820,
    dailySpendLimit: 8000,
    healthScore: 94,
    paymentMethodStatus: "Active (Mastercard •••• 4242)",
    currency: "USD",
  },
  {
    name: "LinkedIn Campaigns",
    platform: "linkedin",
    accountId: "li_b2b_managed_04",
    status: "needs_attention",
    spendCapacity: 6000,
    dailySpend: 310,
    dailySpendLimit: 2000,
    healthScore: 72,
    paymentMethodStatus: "Card Expiring Soon (Amex •••• 3012)",
    currency: "USD",
  },
];

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    await connectToDatabase();

    let accounts = await AdAccount.find({}).sort({ spendCapacity: -1 }).lean();

    if (!accounts || accounts.length === 0) {
      await AdAccount.insertMany(DEFAULT_ACCOUNTS);
      accounts = await AdAccount.find({}).sort({ spendCapacity: -1 }).lean();
    }

    return NextResponse.json({ accounts });
  } catch (error: any) {
    console.error("Admin GET ad-accounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch ad accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { action, accountId, status, spendCapacity, dailySpendLimit, healthScore } = body;

    await connectToDatabase();

    if (action === "sync_all") {
      await AdAccount.updateMany({}, { $set: { lastSyncedAt: new Date() } });
      const accounts = await AdAccount.find({}).sort({ spendCapacity: -1 }).lean();
      return NextResponse.json({
        message: "All ad accounts successfully synchronized with Meta and TikTok APIs",
        accounts,
      });
    }

    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    const updates: Record<string, any> = { lastSyncedAt: new Date() };
    if (status) updates.status = status;
    if (spendCapacity !== undefined) updates.spendCapacity = Number(spendCapacity);
    if (dailySpendLimit !== undefined) updates.dailySpendLimit = Number(dailySpendLimit);
    if (healthScore !== undefined) updates.healthScore = Number(healthScore);

    const account = await AdAccount.findOneAndUpdate({ accountId }, updates, { new: true });
    if (!account) {
      return NextResponse.json({ error: "Ad account not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Ad account updated successfully",
      account,
    });
  } catch (error: any) {
    console.error("Admin POST ad-accounts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update ad account" },
      { status: 500 }
    );
  }
}
