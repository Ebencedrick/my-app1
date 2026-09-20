import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import Wallet from "@/models/Wallet";
import LedgerEntry from "@/models/LedgerEntry";
import SupportTicket from "@/models/SupportTicket";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    // If specific user ID requested, return user details + their campaigns
    if (targetUserId) {
      const user = await User.findById(targetUserId).select("-password").lean();
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const campaigns = await Campaign.find({ userId: targetUserId })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        user,
        campaigns,
      });
    }

    // Fetch all users
    const rawUsers = await User.find({}).select("-password").sort({ createdAt: -1 }).lean();

    // Aggregate campaign metrics per user
    const campaignAgg = await Campaign.aggregate([
      {
        $group: {
          _id: "$userId",
          campaignCount: { $sum: 1 },
          totalSpend: { $sum: "$totalAdSpend" },
        },
      },
    ]);

    const campaignMap = new Map<string, { count: number; spend: number }>();
    for (const item of campaignAgg) {
      if (item._id) {
        campaignMap.set(item._id.toString(), {
          count: item.campaignCount || 0,
          spend: item.totalSpend || 0,
        });
      }
    }

    // Aggregate wallet balance per user via wallets + completed ledger entries
    const wallets = await Wallet.find({}).lean();
    const walletByUserId = new Map<string, string>();
    for (const w of wallets) {
      walletByUserId.set(w.userId.toString(), w._id.toString());
    }

    const ledgerAgg = await LedgerEntry.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { walletId: "$walletId", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const walletBalances = new Map<string, number>();
    for (const entry of ledgerAgg) {
      const wid = entry._id.walletId?.toString();
      if (!wid) continue;
      const prev = walletBalances.get(wid) || 0;
      const type = entry._id.type;
      const amt = entry.total || 0;
      if (type === "deposit" || type === "refund") {
        walletBalances.set(wid, prev + amt);
      } else if (type === "settlement") {
        walletBalances.set(wid, Math.max(0, prev - amt));
      }
    }

    const users = rawUsers.map((u: any) => {
      const uid = u._id.toString();
      const stats = campaignMap.get(uid) || { count: 0, spend: 0 };
      const wid = walletByUserId.get(uid);
      const balance = wid ? walletBalances.get(wid) || 0 : 0;

      return {
        ...u,
        campaignsCount: stats.count,
        totalSpend: Number(stats.spend.toFixed(2)),
        walletBalance: Number(balance.toFixed(2)),
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Admin GET users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { userId, message, subject = "Message from Platform Administration" } = body;

    if (!userId || !message || !message.trim()) {
      return NextResponse.json(
        { error: "userId and message are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find active ticket or create new one
    let ticket = await SupportTicket.findOne({
      userEmail: user.email.toLowerCase().trim(),
      status: { $in: ["open", "in_progress"] },
    });

    if (ticket) {
      ticket.replies.push({
        senderRole: "admin",
        senderName: "Operations & Admin Desk",
        message: message.trim(),
        createdAt: new Date(),
      });
      ticket.unreadByUser = true;
      await ticket.save();
    } else {
      ticket = await SupportTicket.create({
        userId: user._id,
        userEmail: user.email.toLowerCase().trim(),
        userName: user.businessName || user.email,
        subject: subject.trim(),
        message: message.trim(),
        status: "open",
        priority: "high",
        unreadByUser: true,
        unreadByAdmin: false,
        replies: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: `Message dispatched to ${user.email}. User has been notified.`,
      ticket,
    });
  } catch (error: any) {
    console.error("Admin POST send user message error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message to user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { userId, kycStatus, role, planId, phoneVerified } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updateFields: Record<string, any> = {};

    if (kycStatus) {
      const allowedKyc = ["unverified", "pending", "verified", "rejected"];
      if (!allowedKyc.includes(kycStatus)) {
        return NextResponse.json({ error: "Invalid kycStatus value" }, { status: 400 });
      }
      updateFields.kycStatus = kycStatus;
    }

    if (role) {
      const allowedRoles = ["user", "admin"];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
      }
      updateFields.role = role;
    }

    if (typeof planId === "string" && planId.trim()) {
      updateFields.planId = planId.trim();
    }

    if (typeof phoneVerified === "boolean") {
      updateFields.phoneVerified = phoneVerified;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Admin PATCH user error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
