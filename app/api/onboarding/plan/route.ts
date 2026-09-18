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

    const body = await request.json().catch(() => ({}));
    const { planId } = body || {};

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        onboardingComplete: true,
        planId: planId || "pay_as_you_go",
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error: any) {
    console.error("Onboarding plan completion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
