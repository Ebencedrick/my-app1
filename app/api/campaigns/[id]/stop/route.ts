import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Campaign from "@/models/Campaign";
import LedgerEntry from "@/models/LedgerEntry";
import { ensureUserWallet, releaseCampaignHold, getWalletBalanceSummary } from "@/lib/ledger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
    }

    await connectToDatabase();
    const campaign = await Campaign.findOne({ _id: id, userId: user._id });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status === "completed") {
      return NextResponse.json({ error: "Campaign is already completed" }, { status: 400 });
    }

    // Set campaign status to completed
    campaign.status = "completed";
    campaign.endDate = new Date();
    await campaign.save();

    // Reconcile and release unspent hold
    const wallet = await ensureUserWallet(user._id);

    // Find all ledger entries related to this campaign
    const entries = await LedgerEntry.find({
      walletId: wallet._id,
      campaignId: campaign._id,
      status: "completed",
    });

    let totalHold = 0;
    let totalSettled = 0;
    let totalReleased = 0;

    for (const entry of entries) {
      if (entry.type === "hold") totalHold += entry.amount;
      if (entry.type === "settlement") totalSettled += entry.amount;
      if (entry.type === "holdRelease") totalReleased += entry.amount;
    }

    const unusedHold = Math.max(0, Number((totalHold - totalSettled - totalReleased).toFixed(2)));

    if (unusedHold > 0) {
      await releaseCampaignHold({
        walletId: wallet._id,
        campaignId: campaign._id,
        amount: unusedHold,
        reason: "Campaign stopped early by user",
      });
    }

    const updatedSummary = await getWalletBalanceSummary(wallet._id);

    return NextResponse.json({
      success: true,
      campaign,
      refundedAmount: unusedHold,
      walletBalance: updatedSummary.availableBalance,
    });
  } catch (error: any) {
    console.error("Stop campaign error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to stop campaign" },
      { status: 500 }
    );
  }
}
