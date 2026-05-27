import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_ADMIN, COOKIE_VISITOR } from "@/lib/session";
import { isMicrosoftEmail } from "@/lib/microsoft-access";

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

  // Read both cookies up front — admin auth can short-circuit hub gates.
  const adminToken = req.cookies.get(COOKIE_ADMIN)?.value;
  const adminSession = await verifySession(adminToken);
  const isAdmin = adminSession?.role === "admin";

  // ---- Admin gate ----
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ---- Visitor hub gate ----
  if (pathname.startsWith("/customer") || pathname.startsWith("/microsoft")) {
    // Admin gets preview access to both hubs without needing a visitor
    // cookie or matching the Microsoft email rule. Convenience feature
    // so admins can demo the hubs without logging out of /admin.
    if (isAdmin) return NextResponse.next();

    const visitorToken = req.cookies.get(COOKIE_VISITOR)?.value;
    const session = await verifySession(visitorToken);
    if (!session || session.role !== "visitor") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Microsoft hub requires a verified @microsoft.com email (or an entry
    // in MICROSOFT_TEST_EMAILS env var, or one of the bypass logins —
    // see lib/microsoft-access.ts).
    if (pathname.startsWith("/microsoft")) {
      const email = String(session.sub || "");
      if (!isMicrosoftEmail(email)) {
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
