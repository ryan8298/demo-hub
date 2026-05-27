import { NextRequest, NextResponse } from "next/server";
import {
  signSession,
  cookieOptions,
  COOKIE_ADMIN,
  COOKIE_VISITOR,
  ADMIN_TTL_SECONDS,
  VISITOR_TTL_SECONDS,
} from "@/lib/session";
import { getBypassLogin, normalizeEmail } from "@/lib/bypass-logins";
import { consume, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/auth/bypass-login
 *
 * Demo-only shortcut: if the supplied email matches one of the hardcoded
 * bypass logins (see lib/bypass-logins.ts), issue the appropriate cookie
 * and return the redirect URL.
 *
 * Any non-bypass email is rejected — those have to go through the normal
 * OTP flow via /api/auth/send-otp + /api/auth/verify-otp.
 */

// Generous limit — these are used during live demos, not by bots.
const LIMIT = 30;
const WINDOW_SECONDS = 600;

export async function POST(req: NextRequest) {
  // Rate limit by IP — protects against someone discovering the bypass
  // emails and trying to brute force admin access.
  const ip = clientIp(req);
  const rl = consume(`bypass-login:ip:${ip}`, LIMIT, WINDOW_SECONDS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(rl.resetSeconds / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
    );
  }

  let email = "";
  try {
    const body = await req.json();
    email = normalizeEmail(body?.email ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const bypass = getBypassLogin(email);
  if (!bypass) {
    return NextResponse.json(
      { error: "Not a bypass login email. Use the standard sign-in flow." },
      { status: 400 }
    );
  }

  const now = Math.floor(Date.now() / 1000);

  if (bypass.role === "admin") {
    const exp = now + ADMIN_TTL_SECONDS;
    const token = await signSession({ sub: "admin", role: "admin", exp });
    const res = NextResponse.json({ success: true, redirect: bypass.redirect });
    res.cookies.set(COOKIE_ADMIN, token, cookieOptions(ADMIN_TTL_SECONDS));
    return res;
  }

  // Visitor (client@ or microsoft@)
  const exp = now + VISITOR_TTL_SECONDS;
  const token = await signSession({
    sub: email,
    role: "visitor",
    exp,
    data: {
      is_microsoft: !!bypass.is_microsoft,
      first_name: "Demo",
      last_name: "User",
      company_name: "Echelix",
    },
  });
  const res = NextResponse.json({ success: true, redirect: bypass.redirect });
  res.cookies.set(COOKIE_VISITOR, token, cookieOptions(VISITOR_TTL_SECONDS));
  return res;
}
