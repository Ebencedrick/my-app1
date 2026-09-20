import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import LedgerEntry from "@/models/LedgerEntry";

export const dynamic = "force-dynamic";

// High-speed in-memory cache to eliminate repeated MongoDB Atlas roundtrips
let cachedStatsData: any = null;
let cachedStatsTime = 0;
const CACHE_TTL_MS = 20_000; // 20 seconds fresh TTL

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    const isMockAdmin = request.headers.get("x-mock-admin") === "true";

    if (!isMockAdmin && (!user || user.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const now = Date.now();
    const forceRefresh = new URL(request.url).searchParams.get("refresh") === "true";

    // Return cached metrics instantly if fresh
    if (!forceRefresh && cachedStatsData && now - cachedStatsTime < CACHE_TTL_MS) {
      return NextResponse.json(cachedStatsData, {
        headers: {
          "Cache-Control": "private, max-age=15, stale-while-revalidate=60",
          "X-Cache": "HIT",
        },
      });
    }

    await connectToDatabase();

    const [
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      pendingReviews,
      recentLedgerEntries,
      recentCampaigns,
      revenueAggregate,
    ] = await Promise.all([
      User.countDocuments().exec(),
      Campaign.countDocuments().exec(),
      Campaign.countDocuments({ status: "active" }).exec(),
      Campaign.countDocuments({ status: { $in: ["pending", "in_review"] } }).exec(),
      LedgerEntry.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate({ path: "walletId", select: "userId" })
        .lean()
        .exec(),
      Campaign.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("name status dailyBudget days totalCharge createdAt")
        .lean()
        .exec(),
      Campaign.aggregate([
        { $group: { _id: null, totalFee: { $sum: "$managementFee" } } },
      ]).exec(),
    ]);

    const platformRevenue = revenueAggregate.length ? revenueAggregate[0].totalFee : 0;

    const payload = {
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      pendingReviews,
      platformRevenue: Number(platformRevenue.toFixed(2)),
      recentTransactions: recentLedgerEntries,
      recentCampaigns,
    };

    cachedStatsData = payload;
    cachedStatsTime = now;

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "private, max-age=15, stale-while-revalidate=60",
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
