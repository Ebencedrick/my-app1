import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import connectToDatabase from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import { ensureUserWallet, recordDeposit } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const methodFilter = searchParams.get("method");

    const query: Record<string, any> = {};
    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter;
    }
    if (methodFilter && methodFilter !== "all") {
      query.method = methodFilter;
    }

    const [deposits, allUsers, agg] = await Promise.all([
      Deposit.find(query)
        .populate("userId", "email businessName phone")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      User.find({}).select("_id email businessName").lean(),
      Deposit.aggregate([
        {
          $group: {
            _id: "$status",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      totalConfirmedVolume: 0,
      totalPendingVolume: 0,
      pendingCount: 0,
      failedCount: 0,
    };

    for (const item of agg) {
      if (item._id === "confirmed") {
        stats.totalConfirmedVolume = Number((item.totalAmount || 0).toFixed(2));
      } else if (item._id === "pending") {
        stats.totalPendingVolume = Number((item.totalAmount || 0).toFixed(2));
        stats.pendingCount = item.count || 0;
      } else if (item._id === "failed" || item._id === "expired") {
        stats.failedCount += item.count || 0;
      }
    }

    return NextResponse.json({
      deposits,
      stats,
      users: allUsers,
    });
  } catch (error: any) {
    console.error("Admin GET deposits error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch deposits" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { depositId, action, reason } = body;

    if (!depositId || !action) {
      return NextResponse.json(
        { error: "depositId and action ('confirm' | 'reject') are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }

    if (deposit.status === "confirmed") {
      return NextResponse.json(
        { error: "Deposit has already been confirmed" },
        { status: 400 }
      );
    }

    if (action === "confirm") {
      deposit.status = "confirmed";
      deposit.confirmedAt = new Date();
      await deposit.save();

      // Ensure user wallet and record ledger entry
      const wallet = await ensureUserWallet(deposit.userId);
      await recordDeposit({
        walletId: wallet._id.toString(),
        amount: deposit.amount,
        gateway: deposit.method,
        gatewayRef: deposit.gatewayRef || `DEP_ADMIN_${deposit._id}`,
        metadata: {
          approvedByAdmin: true,
          depositId: deposit._id.toString(),
        },
      });

      return NextResponse.json({
        message: "Deposit confirmed and funds credited to user wallet",
        deposit,
      });
    } else if (action === "reject") {
      deposit.status = "failed";
      deposit.metadata = {
        ...(deposit.metadata || {}),
        rejectionReason: reason || "Rejected by administrator",
      };
      await deposit.save();

      return NextResponse.json({
        message: "Deposit marked as failed/rejected",
        deposit,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'confirm' or 'reject'" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Admin PATCH deposit error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update deposit" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { userId, amount, method = "momo", notes = "" } = body;

    const numericAmount = Number(amount);
    if (!userId || !numericAmount || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Valid userId and positive amount are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const ref = `MANUAL_CREDIT_${Date.now()}`;

    // Create deposit record
    const deposit = await Deposit.create({
      userId: user._id,
      method: method === "crypto" ? "crypto" : "momo",
      amount: numericAmount,
      currency: "USD",
      originalCurrency: "USD",
      originalAmount: numericAmount,
      status: "confirmed",
      confirmedAt: new Date(),
      gatewayRef: ref,
      metadata: {
        adminManualCredit: true,
        notes,
        creditedAt: new Date().toISOString(),
      },
    });

    // Credit wallet via ledger
    const wallet = await ensureUserWallet(user._id);
    const ledgerEntry = await recordDeposit({
      walletId: wallet._id.toString(),
      amount: numericAmount,
      gateway: method === "crypto" ? "crypto" : "momo",
      gatewayRef: ref,
      metadata: {
        adminManualCredit: true,
        notes,
        depositId: deposit._id.toString(),
      },
    });

    return NextResponse.json({
      message: `Successfully credited $${numericAmount.toFixed(2)} to ${user.email}`,
      deposit,
      ledgerEntry,
    });
  } catch (error: any) {
    console.error("Admin manual deposit credit error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process manual credit" },
      { status: 500 }
    );
  }
}
