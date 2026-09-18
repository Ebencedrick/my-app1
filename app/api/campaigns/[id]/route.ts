import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Campaign from "@/models/Campaign";
import LedgerEntry from "@/models/LedgerEntry";
import { ensureUserWallet, releaseCampaignHold } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET(
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

    return NextResponse.json({ campaign });
  } catch (error: any) {
    console.error("GET /api/campaigns/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await request.json();
    const { status, name } = body || {};

    await connectToDatabase();
    const campaign = await Campaign.findOne({ _id: id, userId: user._id });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (status && ["active", "paused", "draft", "pending"].includes(status)) {
      campaign.status = status;
    }
    if (name) {
      campaign.name = name.trim();
    }

    await campaign.save();

    return NextResponse.json({ campaign });
  } catch (error: any) {
    console.error("PATCH /api/campaigns/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Release any unused hold if present
    const wallet = await ensureUserWallet(user._id);
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
        reason: "Campaign deleted by user",
      });
    }

    await Campaign.deleteOne({ _id: campaign._id });

    return NextResponse.json({ success: true, message: "Campaign deleted" });
  } catch (error: any) {
    console.error("DELETE /api/campaigns/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
