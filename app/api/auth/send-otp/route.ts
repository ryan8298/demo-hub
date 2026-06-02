import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabaseAdmin } from "@/lib/supabase";
import { isMicrosoftEmail } from "@/lib/microsoft-access";
import { consume, clientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 5 OTP send requests per IP per 10 minutes. Resend free tier is 100/day,
// so this protects both quota and real users from accidental abuse.
const SEND_LIMIT = 5;
const SEND_WINDOW_SECONDS = 600;

/**
 * Step 1 of visitor auth: send a one-time passcode (6-8 digits, configurable
 * in the Supabase dashboard) to the supplied email address using Supabase Auth.
 *
 * Verification (step 2) is in /api/auth/verify-otp.
 */
export async function POST(req: NextRequest) {
  let email = "";
  let first_name = "";
  let last_name = "";
  let company_name = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    first_name = String(body?.first_name ?? "").trim();
    last_name = String(body?.last_name ?? "").trim();
    company_name = String(body?.company_name ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid work email." },
      { status: 400 }
    );
  }

  // Rate limit by IP first (cheap, no DB hit). Use both IP and email keys
  // so an attacker can't brute one email across IPs and a shared NAT can't
  // lock out an entire office.
  const ip = clientIp(req);
  const ipResult = consume(`otp-send:ip:${ip}`, SEND_LIMIT, SEND_WINDOW_SECONDS);
  const emailResult = consume(
    `otp-send:email:${email}`,
    SEND_LIMIT,
    SEND_WINDOW_SECONDS
  );
  if (!ipResult.ok || !emailResult.ok) {
    const reset = Math.max(ipResult.resetSeconds, emailResult.resetSeconds);
    return NextResponse.json(
      {
        error: `Too many code requests. Try again in ${Math.ceil(reset / 60)} minute${
          reset > 60 ? "s" : ""
        }.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(reset) },
      }
    );
  }

  // Supabase Auth sends a 6- or 8-digit code (configurable in dashboard;
  // email template = "Magic Link",
  // {{ .Token }}). User may also click the magic-link button if the template
  // includes it — verifyOtp will accept either.
  const { error } = await supabaseAdmin.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    // Full detail in server logs (Vercel → Logs)
    console.error("Supabase signInWithOtp failed:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    // Map Supabase's most common failure modes to user-friendly messages.
    const msg = error.message?.toLowerCase() ?? "";
    let userMessage = "We couldn't send the code. Please try again in a minute.";
    let httpStatus = 500;

    if (msg.includes("rate") || msg.includes("limit") || error.status === 429) {
      userMessage =
        "Too many code requests right now. Please wait a few minutes before trying again.";
      httpStatus = 429;
    } else if (msg.includes("smtp") || msg.includes("send")) {
      userMessage =
        "Email delivery is temporarily unavailable. Please try again shortly.";
      httpStatus = 503;
    } else if (msg.includes("invalid") && msg.includes("email")) {
      userMessage = "That email doesn't look valid. Please double-check it.";
      httpStatus = 400;
    }

    return NextResponse.json({ error: userMessage }, { status: httpStatus });
  }

  // Capture the lead at request time so it mirrors what Resend sees — even if
  // the visitor never finishes verifying. The landing form collects the full
  // profile before this call; we only upsert when those NOT NULL fields are
  // present. verify-otp later upserts again to confirm. Best-effort: a failure
  // here must never block the (already-sent) code.
  if (first_name && last_name && company_name) {
    try {
      const { error: leadError } = await supabaseAdmin.from("visitor_sessions").upsert(
        {
          email,
          first_name,
          last_name,
          company_name,
          is_microsoft: isMicrosoftEmail(email),
          session_token: uuidv4(),
        },
        { onConflict: "email" }
      );
      if (leadError) {
        console.error("send-otp visitor_sessions upsert failed:", leadError.message);
      }
    } catch (e) {
      console.error("send-otp visitor_sessions upsert threw:", e);
    }
  }

  return NextResponse.json({ success: true });
}
