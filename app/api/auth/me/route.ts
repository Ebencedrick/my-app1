import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import Wallet from "@/models/Wallet";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    // Also get wallet id if exists
    const wallet = await Wallet.findOne({ userId: user._id }).select("_id currency");

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        industry: user.industry,
        website: user.website,
        campaignGoal: user.campaignGoal,
        audience: user.audience,
        budget: user.budget,
        platformFocus: user.platformFocus,
        role: user.role,
        planId: user.planId,
        kycStatus: user.kycStatus,
        kycDocumentName: user.kycDocumentName,
        phoneVerified: user.phoneVerified,
        onboardingComplete: user.onboardingComplete,
        walletId: wallet?._id?.toString(),
        walletCurrency: wallet?.currency || "USD",
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { authenticated: false, error: error.message || "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
