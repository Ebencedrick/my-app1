import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ensureUserWallet, recordDeposit, getWalletBalanceSummary } from "@/lib/ledger";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, gateway, gatewayRef, phone, metadata } = body || {};
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Deposit amount must be a positive number" },
        { status: 400 }
      );
    }

    const wallet = await ensureUserWallet(user._id);

    const entry = await recordDeposit({
      walletId: wallet._id,
      amount: parsedAmount,
      gateway: gateway === "crypto" ? "crypto" : "momo",
      gatewayRef: gatewayRef || `MOMO_${Date.now()}_${phone || "direct"}`,
      metadata: {
        ...(phone ? { phone } : {}),
        ...(metadata || {}),
        depositedBy: user.email,
      },
    });

    const summary = await getWalletBalanceSummary(wallet._id);

    return NextResponse.json({
      success: true,
      balance: summary.availableBalance,
      summary,
      entry,
    });
  } catch (error: any) {
    console.error("Wallet deposit error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process deposit" },
      { status: 500 }
    );
  }
}
