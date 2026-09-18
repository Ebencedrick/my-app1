import { NextResponse } from "next/server";
import { ensureUser, creditWallet } from "@/lib/dataStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, initialTopUp } = body || {};
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    ensureUser(email);
    if (initialTopUp && Number(initialTopUp) > 0) {
      creditWallet(email, Number(initialTopUp));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
