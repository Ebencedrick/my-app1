import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { ensureUserWallet, getWalletTransactions } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    const wallet = await ensureUserWallet(user._id);
    const transactions = await getWalletTransactions(wallet._id, limit, skip);

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error("Wallet transactions error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wallet transactions" },
      { status: 500 }
    );
  }
}
