import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Campaign from "@/models/Campaign";
import { ensureUserWallet, getWalletBalanceSummary, placeCampaignHold } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const campaigns = await Campaign.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error("GET /api/campaigns error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body || !body.objective) {
      return NextResponse.json({ error: "Campaign objective is required" }, { status: 400 });
    }

    const dailyBudget = Number(body.dailyBudget) || 10;
    const days = Number(body.days) || 7;
    const totalAdSpend = Number((dailyBudget * days).toFixed(2));
    const managementFee = Number((totalAdSpend * 0.05).toFixed(2)); // 5% platform fee
    const totalCharge = Number((totalAdSpend + managementFee).toFixed(2));

    await connectToDatabase();
    const wallet = await ensureUserWallet(user._id);
    const balanceSummary = await getWalletBalanceSummary(wallet._id);

    if (balanceSummary.availableBalance < totalCharge) {
      return NextResponse.json(
        {
          error: `Insufficient available funds. Required campaign budget is $${totalCharge.toFixed(2)}, but your available balance is $${balanceSummary.availableBalance.toFixed(2)}. Please add funds to your wallet first.`,
          required: totalCharge,
          available: balanceSummary.availableBalance,
        },
        { status: 402 }
      );
    }

    const platforms = Array.isArray(body.platforms) && body.platforms.length > 0
      ? body.platforms
      : ["facebook"];

    const campaign = await Campaign.create({
      userId: user._id,
      name: body.name ? body.name.trim() : `Campaign ${new Date().toLocaleDateString()}`,
      objective: body.objective,
      platforms,
      status: "pending",
      dailyBudget,
      days,
      totalAdSpend,
      managementFee,
      totalCharge,
      startDate: new Date(),
      endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      adSets: platforms.map((platform: string) => ({
        platform: platform.toLowerCase(),
        targeting: body.targeting || {},
      })),
      creative: body.creative || {},
    });

    // Place hold in ledger
    const holdResult = await placeCampaignHold({
      walletId: wallet._id,
      campaignId: campaign._id,
      amount: totalCharge,
      metadata: {
        campaignName: campaign.name,
        days,
        dailyBudget,
      },
    });

    if (!holdResult.success) {
      // Rollback campaign creation if hold failed
      await Campaign.deleteOne({ _id: campaign._id });
      return NextResponse.json(
        { error: holdResult.error || "Failed to place budget hold" },
        { status: 402 }
      );
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/campaigns error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create campaign" },
      { status: 500 }
    );
  }
}
