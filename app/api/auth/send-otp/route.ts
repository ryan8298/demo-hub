import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Step 1 of visitor auth: send a 6-digit one-time passcode to the supplied
 * email address using Supabase Auth.
 *
 * Verification (step 2) is in /api/auth/verify-otp.
 */
export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid work email." },
      { status: 400 }
    );
  }

  // Supabase Auth sends a 6-digit code by default (email template = "Magic Link",
  // {{ .Token }}). User may also click the magic-link button if the template
  // includes it — verifyOtp will accept either.
  const { error } = await supabaseAdmin.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) {
    console.error("OTP send error:", error.message);
    return NextResponse.json(
      { error: "Couldn't send code. Please try again in a minute." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
