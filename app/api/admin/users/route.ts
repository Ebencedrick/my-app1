import { NextResponse } from "next/server";
import { getUsers } from "@/lib/dataStore";

export async function GET(request: Request) {
  const isAdmin = request.headers.get("x-mock-admin") === "true";
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const users = getUsers();
  return NextResponse.json({ users });
}
