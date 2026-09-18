import { NextResponse } from "next/server";
import { getCampaigns, createCampaign, ensureUser } from "@/lib/dataStore";

export async function GET(request: Request) {
  const owner = request.headers.get("x-mock-user") || undefined;
  const campaigns = getCampaigns(owner as string | undefined);
  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  try {
    const owner = request.headers.get("x-mock-user") || undefined;
    const body = await request.json();
    if (!body) return NextResponse.json({ error: "Missing body" }, { status: 400 });
    if (!body.objective) return NextResponse.json({ error: "Missing objective" }, { status: 400 });

    if (owner) ensureUser(owner);

    const campaign = createCampaign({
      name: body.name || `Campaign`,
      objective: body.objective,
      platforms: body.platforms || [],
      targeting: body.targeting || {},
      budget: body.budget || 0,
      status: body.status || "pending",
    }, owner || undefined);

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
