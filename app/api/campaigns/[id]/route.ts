import { NextResponse } from "next/server";
import { getCampaign, updateCampaign } from "@/lib/dataStore";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const campaign = getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ campaign });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const updated = updateCampaign(id, body);
    if (!updated) return NextResponse.json({ error: "Not found or update failed" }, { status: 404 });
    return NextResponse.json({ campaign: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
