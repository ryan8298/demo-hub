import { NextRequest, NextResponse } from "next/server";
import {
  signSession,
  cookieOptions,
  COOKIE_ADMIN,
  ADMIN_TTL_SECONDS,
} from "@/lib/session";
import { consume, clientIp } from "@/lib/rate-limit";

// 10 admin login attempts per IP per 15 minutes.
const ADMIN_LIMIT = 10;
const ADMIN_WINDOW_SECONDS = 900;

// Constant-time string compare for password check
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // Misconfigured server. Fail closed.
    return NextResponse.json(
      { error: "Admin login is disabled (server not configured)" },
      { status: 503 }
    );
  }

  // Rate limit by IP — protects against password spraying.
  const ip = clientIp(req);
  const rl = consume(`admin-login:ip:${ip}`, ADMIN_LIMIT, ADMIN_WINDOW_SECONDS);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many attempts. Try again in ${Math.ceil(rl.resetSeconds / 60)} minute${
          rl.resetSeconds > 60 ? "s" : ""
        }.`,
      },
      { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!password || !safeEqual(password, expected)) {
    // Generic message — do not reveal whether the password is right or wrong specifically
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const exp = Math.floor(Date.now() / 1000) + ADMIN_TTL_SECONDS;
  const token = await signSession({ sub: "admin", role: "admin", exp });

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_ADMIN, token, cookieOptions(ADMIN_TTL_SECONDS));
  return res;
}
