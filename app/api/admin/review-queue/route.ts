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

    const pendingCampaigns = await Campaign.find({
      status: { $in: ["pending", "in_review"] },
    })
      .populate("userId", "email businessName phone")
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      count: pendingCampaigns.length,
      queue: pendingCampaigns,
    });
  } catch (error: any) {
    console.error("Admin GET review-queue error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch review queue" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { campaignId, decision, reason } = body;

    if (!campaignId || !decision) {
      return NextResponse.json(
        { error: "campaignId and decision ('approve' | 'reject') are required" },
        { status: 400 }
      );
    }

    if (decision !== "approve" && decision !== "reject") {
      return NextResponse.json(
        { error: "decision must be either 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (decision === "approve") {
      campaign.status = "active";
      campaign.startDate = new Date();
      await campaign.save();

      return NextResponse.json({
        message: "Campaign approved and activated successfully",
        campaign,
      });
    } else {
      // Rejection flow
      campaign.status = "rejected";
      const rejectionReasonText = reason || "Ad creative/copy flagged during moderation review";
      (campaign as any).rejectionReason = rejectionReasonText;
      await campaign.save();

      // Release any active holds for this campaign back to the user's available balance
      let holdReleased = false;
      let releasedAmount = 0;

      try {
        const wallet = await Wallet.findOne({ userId: campaign.userId });
        if (wallet) {
          const holdEntries = await LedgerEntry.aggregate([
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
          for (const h of holdEntries) {
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
              reason: `Campaign rejected by moderation: ${rejectionReasonText}`,
            });
            holdReleased = true;
            releasedAmount = remainingHold;
          }
        }
      } catch (ledgerErr) {
        console.error("Failed to release hold on review rejection:", ledgerErr);
      }

      return NextResponse.json({
        message: "Campaign rejected. Funds released to user's wallet.",
        rejectionReason: rejectionReasonText,
        holdReleased,
        releasedAmount,
        campaign,
      });
    }
  } catch (error: any) {
    console.error("Admin POST review-queue error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process review decision" },
      { status: 500 }
    );
  }
}
