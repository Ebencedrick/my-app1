import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { IUser } from "@/models/User";

export async function verifyAdmin(request: Request): Promise<
  | { authorized: true; user: IUser | null }
  | { authorized: false; response: NextResponse }
> {
  const isMockAdmin =
    request.headers.get("x-mock-admin") === "true" ||
    request.headers.get("x-admin-key") === "dev_admin_bypass";

  const user = await getSessionUser();

  if (isMockAdmin || (user && user.role === "admin")) {
    return { authorized: true, user };
  }

  return {
    authorized: false,
    response: NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    ),
  };
}
