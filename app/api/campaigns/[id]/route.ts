import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `GET campaign ${params.id} placeholder` });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `PATCH campaign ${params.id} placeholder` });
}
