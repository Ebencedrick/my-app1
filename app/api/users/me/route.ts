import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
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
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, phone, businessName, industry, website, themePreference } = body || {};

    await connectToDatabase();
    const dbUser = await User.findById(sessionUser._id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. If email change requested:
    if (email && email.trim().toLowerCase() !== dbUser.email) {
      const normalizedEmail = email.trim().toLowerCase();
      // Check if email format is valid
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }

      // Check for collision with another user in MongoDB
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: dbUser._id },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email address is already in use by another account" },
          { status: 409 }
        );
      }

      dbUser.email = normalizedEmail;

      // Re-issue JWT session cookie with updated email
      const newToken = await createSessionToken({
        userId: dbUser._id.toString(),
        email: dbUser.email,
        role: dbUser.role || "user",
      });

      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    // 2. Profile identity fields:
    if (phone !== undefined) dbUser.phone = phone.trim();
    if (businessName !== undefined) dbUser.businessName = businessName.trim();
    if (industry !== undefined) dbUser.industry = industry.trim();
    if (website !== undefined) dbUser.website = website.trim();
    if (themePreference !== undefined) dbUser.themePreference = themePreference;

    await dbUser.save();

    const safeUser = dbUser.toObject();
    delete safeUser.password;

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: "Credentials updated successfully in database",
    });
  } catch (error: any) {
    console.error("Update credentials error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
