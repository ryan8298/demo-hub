import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession, COOKIE_VISITOR } from "@/lib/session";

/**
 * GET /api/me
 *
 * Lightweight "am I a signed-in visitor?" check for client components.
 * The visitor cookie is httpOnly (JS can't read it), so the PDF-download
 * gate calls this to decide whether to prompt for an email (anonymous) or
 * silently attribute the download to the logged-in visitor.
 *
 * Returns the visitor's identity from the signed session — no DB hit.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const session = await verifySession(store.get(COOKIE_VISITOR)?.value);

  if (session?.role === "visitor") {
    const d = (session.data ?? {}) as {
      first_name?: string;
      last_name?: string;
      company_name?: string;
      is_microsoft?: boolean;
    };
    const name = [d.first_name, d.last_name].filter(Boolean).join(" ").trim();
    return NextResponse.json({
      authenticated: true,
      email: String(session.sub || ""),
      name: name || null,
      company_name: d.company_name || null,
      isMicrosoft: !!d.is_microsoft,
    });
  }

  return NextResponse.json({ authenticated: false });
}
