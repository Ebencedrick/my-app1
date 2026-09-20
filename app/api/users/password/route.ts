import { NextResponse } from "next/server";
import { getSessionUser, verifyPassword, hashPassword } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { currentPassword, newPassword } = body || {};

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const dbUser = await User.findById(sessionUser._id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password if user already has one set
    if (dbUser.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 }
        );
      }
      const isMatch = await verifyPassword(currentPassword, dbUser.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Hash and store new password in MongoDB Atlas
    dbUser.password = await hashPassword(newPassword);
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully in database",
    });
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update password" },
      { status: 500 }
    );
  }
}
