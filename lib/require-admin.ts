import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_ADMIN } from "@/lib/session";

/**
 * Returns null when the request is authorized as admin.
 * Returns a 401 NextResponse when it is not.
 *
 * Usage:
 *   const unauth = await requireAdmin(req);
 *   if (unauth) return unauth;
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(COOKIE_ADMIN)?.value;
  const session = await verifySession(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
