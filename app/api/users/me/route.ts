import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, businessName, industry, website } = body || {};

    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        ...(phone ? { phone: phone.trim() } : {}),
        ...(businessName ? { businessName: businessName.trim() } : {}),
        ...(industry ? { industry: industry.trim() } : {}),
        ...(website ? { website: website.trim() } : {}),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}
