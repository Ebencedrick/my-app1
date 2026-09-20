import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/db";
import Campaign from "@/models/Campaign";
import Wallet from "@/models/Wallet";
import LedgerEntry from "@/models/LedgerEntry";
import { releaseCampaignHold } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const platformFilter = searchParams.get("platform");
    const queryFilter = searchParams.get("q");

    const query: Record<string, any> = {};

    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter;
    }

    if (platformFilter && platformFilter !== "all") {
      query.platforms = platformFilter;
    }

    if (queryFilter && queryFilter.trim()) {
      query.name = { $regex: queryFilter.trim(), $options: "i" };
    }

    const campaigns = await Campaign.find(query)
      .populate("userId", "email businessName phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error("Admin GET campaigns error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { campaignId, status, rejectionReason } = body;

    if (!campaignId || !status) {
      return NextResponse.json(
        { error: "campaignId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["active", "paused", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const prevStatus = campaign.status;
    campaign.status = status;

    if (status === "active" && !campaign.startDate) {
      campaign.startDate = new Date();
    }

    if (status === "completed" && !campaign.endDate) {
      campaign.endDate = new Date();
    }

    if (status === "rejected" && rejectionReason) {
      // Record rejection details in metadata
      (campaign as any).rejectionReason = rejectionReason;
    }

    await campaign.save();

    // If campaign is cancelled, rejected, or completed, release any remaining unspent hold
    if (status === "rejected" || status === "completed") {
      try {
        const wallet = await Wallet.findOne({ userId: campaign.userId });
        if (wallet) {
          const holds = await LedgerEntry.aggregate([
            {
              $match: {
                campaignId: campaign._id,
                status: "completed",
              },
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ]);

          const map: Record<string, number> = {};
          for (const h of holds) {
            map[h._id] = h.total || 0;
          }

          const totalHold = map["hold"] || 0;
          const totalSettled = map["settlement"] || 0;
          const totalReleased = map["holdRelease"] || 0;
          const remainingHold = Math.max(0, Number((totalHold - totalSettled - totalReleased).toFixed(2)));

          if (remainingHold > 0) {
            await releaseCampaignHold({
              walletId: wallet._id.toString(),
              campaignId: campaign._id.toString(),
              amount: remainingHold,
              reason: `Admin set status to ${status} - released unused budget of $${remainingHold.toFixed(2)}`,
            });
          }
        }
      } catch (ledgerError) {
        console.error("Failed to release campaign hold on status change:", ledgerError);
      }
    }

    return NextResponse.json({
      message: `Campaign status successfully updated from ${prevStatus} to ${status}`,
      campaign,
    });
  } catch (error: any) {
    console.error("Admin PATCH campaign error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update campaign" },
      { status: 500 }
    );
  }
}
