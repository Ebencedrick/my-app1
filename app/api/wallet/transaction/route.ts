import { NextResponse } from "next/server";
import { creditWallet, debitWallet, getWallet, ensureUser } from "@/lib/dataStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, user } = body || {};
    if (!type || !amount || !user) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    ensureUser(user);

    if (type === "credit") {
      const next = creditWallet(user, Number(amount));
      return NextResponse.json({ balance: next });
    }

    if (type === "debit") {
      const next = debitWallet(user, Number(amount));
      if (next === null) return NextResponse.json({ error: "Insufficient funds" }, { status: 402 });
      return NextResponse.json({ balance: next });
    }

    return NextResponse.json({ error: "Unknown transaction type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
