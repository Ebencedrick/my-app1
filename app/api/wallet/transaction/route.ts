import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { ensureUserWallet, recordDeposit, placeCampaignHold, getWalletBalanceSummary } from "@/lib/ledger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, user: emailOrId, campaignId } = body || {};
    const parsedAmount = Number(amount);

    if (!type || !parsedAmount || parsedAmount <= 0) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // Try session first, fallback to payload user
    let user = await getSessionUser();
    if (!user && emailOrId) {
      await connectToDatabase();
      user = await User.findOne({
        $or: [
          { email: emailOrId.toLowerCase().trim() },
          ...(emailOrId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: emailOrId }] : []),
        ],
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wallet = await ensureUserWallet(user._id);

    if (type === "credit") {
      await recordDeposit({
        walletId: wallet._id,
        amount: parsedAmount,
        gateway: "momo",
        gatewayRef: `CR_${Date.now()}`,
      });
      const summary = await getWalletBalanceSummary(wallet._id);
      return NextResponse.json({ balance: summary.availableBalance, summary });
    }

    if (type === "debit") {
      const holdResult = await placeCampaignHold({
        walletId: wallet._id,
        campaignId,
        amount: parsedAmount,
      });

      if (!holdResult.success) {
        return NextResponse.json(
          { error: holdResult.error || "Insufficient funds" },
          { status: 402 }
        );
      }

      const summary = await getWalletBalanceSummary(wallet._id);
      return NextResponse.json({ balance: summary.availableBalance, summary });
    }

    return NextResponse.json({ error: "Unknown transaction type" }, { status: 400 });
  } catch (e: any) {
    console.error("Wallet transaction error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
