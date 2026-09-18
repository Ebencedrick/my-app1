import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ensureUserWallet, getWalletBalanceSummary } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallet = await ensureUserWallet(user._id);
    const summary = await getWalletBalanceSummary(wallet._id);

    return NextResponse.json({
      balance: summary.availableBalance,
      availableBalance: summary.availableBalance,
      totalBalance: summary.totalBalance,
      activeHold: summary.activeHold,
      totalDeposited: summary.totalDeposited,
      totalSettled: summary.totalSettled,
      totalRefunded: summary.totalRefunded,
      currency: summary.currency,
    });
  } catch (error: any) {
    console.error("Wallet balance error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to calculate wallet balance" },
      { status: 500 }
    );
  }
}
