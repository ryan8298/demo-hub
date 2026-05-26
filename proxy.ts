import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_ADMIN, COOKIE_VISITOR } from "@/lib/session";

/**
 * Next.js 16 Proxy (formerly Middleware) — runs at the edge before
 * routes render. Protects /admin/* routes and the visitor hubs.
 *
 * - /admin/login is always accessible
 * - /admin/* requires a valid admin session cookie
 * - /customer/* and /microsoft/* require a valid visitor session cookie
 *   (Microsoft hub additionally requires the email to be @microsoft.com)
 * - /api/admin/* is enforced separately at the route level (uses same helpers)
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- Admin gate ----
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(COOKIE_ADMIN)?.value;
    const session = await verifySession(token);
    if (!session || session.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ---- Visitor hub gate ----
  if (pathname.startsWith("/customer") || pathname.startsWith("/microsoft")) {
    const token = req.cookies.get(COOKIE_VISITOR)?.value;
    const session = await verifySession(token);
    if (!session || session.role !== "visitor") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Microsoft hub requires a verified @microsoft.com email
    if (pathname.startsWith("/microsoft")) {
      const email = String(session.sub || "").toLowerCase();
      if (!email.endsWith("@microsoft.com")) {
        const url = req.nextUrl.clone();
        url.pathname = "/customer/hub";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/microsoft/:path*"],
};
