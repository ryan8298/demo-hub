import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { supabaseAdmin } from "@/lib/supabase";
import {
  signSession,
  cookieOptions,
  COOKIE_VISITOR,
  VISITOR_TTL_SECONDS,
} from "@/lib/session";
import { isMicrosoftEmail } from "@/lib/microsoft-access";

/**
 * Step 2 of visitor auth: verify the 6-digit code, capture profile data,
 * and issue our HMAC-signed visitor session cookie.
 *
 * Returns { success, redirect } so the client knows which hub to navigate to.
 */
export async function POST(req: NextRequest) {
  let email = "";
  let code = "";
  let first_name = "";
  let last_name = "";
  let company_name = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    code = String(body?.code ?? "").trim();
    first_name = String(body?.first_name ?? "").trim();
    last_name = String(body?.last_name ?? "").trim();
    company_name = String(body?.company_name ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 }
    );
  }

  // Verify the OTP against Supabase Auth.
  //
  // signInWithOtp can issue different token types depending on user state
  // ('email' for existing, 'signup' for brand new, 'magiclink' for the URL
  // variant). Try them all in order — each mismatched attempt is cheap.
  type VerifyResult = Awaited<ReturnType<typeof supabaseAdmin.auth.verifyOtp>>;
  let data: VerifyResult["data"] | null = null;
  const attempts: Array<{
    type: string;
    message?: string;
    status?: number;
    code?: string;
  }> = [];

  for (const type of ["email", "signup", "magiclink"] as const) {
    const result = await supabaseAdmin.auth.verifyOtp({ email, token: code, type });
    attempts.push({
      type,
      message: result.error?.message,
      status: result.error?.status,
      code: result.error?.code,
    });
    if (!result.error && result.data?.user) {
      data = result.data;
      break;
    }
  }

  if (!data) {
    console.error("Supabase verifyOtp failed:", { email, codeLength: code.length, attempts });

    const lastError = attempts[attempts.length - 1];
    const msg = (lastError?.message || "").toLowerCase();
    let userMessage = "Invalid or expired code. Please request a new one.";
    let httpStatus = 401;

    if (msg.includes("expired")) {
      userMessage = "That code has expired. Please request a new one.";
    } else if (msg.includes("rate") || msg.includes("too many") || lastError?.status === 429) {
      userMessage = "Too many attempts. Please wait a few minutes before trying again.";
      httpStatus = 429;
    } else if (msg.includes("invalid")) {
      userMessage = "That code doesn't match. Double-check the digits or request a new one.";
    }

    return NextResponse.json({ error: userMessage }, { status: httpStatus });
  }

  // Microsoft hub eligibility — production = @microsoft.com only, plus any
  // emails/domains listed in MICROSOFT_TEST_EMAILS env var for testing.
  const is_microsoft = isMicrosoftEmail(email);

  // Persist the profile for analytics / personalization.
  if (first_name && last_name && company_name) {
    const { error: profileError } = await supabaseAdmin
      .from("visitor_sessions")
      .upsert(
        {
          email,
          first_name,
          last_name,
          company_name,
          is_microsoft,
          session_token: uuidv4(),
        },
        { onConflict: "email" }
      );
    if (profileError) {
      // Non-fatal — auth succeeded. Log and move on.
      console.error("visitor_sessions upsert failed:", profileError.message);
    }
  }

  // Issue our own signed session cookie (separate from any Supabase auth
  // cookies — we only used signInWithOtp / verifyOtp as a verification
  // channel, not as the source of truth for "is logged in").
  const exp = Math.floor(Date.now() / 1000) + VISITOR_TTL_SECONDS;
  const token = await signSession({
    sub: email,
    role: "visitor",
    exp,
    data: { is_microsoft, first_name, last_name, company_name },
  });

  const res = NextResponse.json({
    success: true,
    redirect: is_microsoft ? "/microsoft/hub" : "/customer/hub",
  });
  res.cookies.set(COOKIE_VISITOR, token, cookieOptions(VISITOR_TTL_SECONDS));
  return res;
}
