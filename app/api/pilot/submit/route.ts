import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { consume, clientIp } from "@/lib/rate-limit";
import { sendPilotNotification } from "@/lib/notify";

/**
 * POST /api/pilot/submit
 *
 * Public endpoint backing the /pilot use-case submission form. Stores the
 * submission via the service-role client (RLS-protected table — see
 * supabase/migrations/20260602000000_use_case_submissions.sql) and fires a
 * best-effort email notification to sales.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generous but abuse-resistant: 5 submissions per IP per 10 minutes.
const LIMIT = 5;
const WINDOW_SECONDS = 600;

// Field length caps to keep payloads sane.
const MAX = { name: 120, email: 200, company: 160, industry: 80, long: 5000 };

function clean(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = consume(`pilot:ip:${ip}`, LIMIT, WINDOW_SECONDS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many submissions. Try again in ${Math.ceil(rl.resetSeconds / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email).toLowerCase();
  const company_name = clean(body.company_name, MAX.company);
  const industry = clean(body.industry, MAX.industry);
  const use_case = clean(body.use_case, MAX.long);
  const current_pain = clean(body.current_pain, MAX.long);
  const desired_outcome = clean(body.desired_outcome, MAX.long);

  // Required fields
  if (!name || !email || !use_case) {
    return NextResponse.json(
      { error: "Please provide your name, email, and a description of your use case." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("use_case_submissions").insert([
    {
      name,
      email,
      company_name: company_name || null,
      industry: industry || null,
      use_case,
      current_pain: current_pain || null,
      desired_outcome: desired_outcome || null,
      source_path: clean(body.source_path, 200) || null,
      user_agent: clean(req.headers.get("user-agent"), 400) || null,
    },
  ]);

  if (error) {
    console.error("pilot submission insert failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't save your submission. Please try again shortly." },
      { status: 500 }
    );
  }

  // Best-effort notification — never blocks or fails the submission.
  await sendPilotNotification({
    name,
    email,
    company_name,
    industry,
    use_case,
    current_pain,
    desired_outcome,
  });

  return NextResponse.json({ success: true });
}
