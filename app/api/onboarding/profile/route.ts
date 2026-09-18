import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, industry, website, phone, campaignGoal, audience, budget, platformFocus } = body || {};

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        ...(businessName ? { businessName: businessName.trim() } : {}),
        ...(industry ? { industry: industry.trim() } : {}),
        ...(website ? { website: website.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(campaignGoal ? { campaignGoal: campaignGoal.trim() } : {}),
        ...(audience ? { audience: audience.trim() } : {}),
        ...(budget ? { budget: budget.trim() } : {}),
        ...(Array.isArray(platformFocus) ? { platformFocus } : {}),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error: any) {
    console.error("Onboarding profile update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
