import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { consume, clientIp } from "@/lib/rate-limit";

/**
 * POST /api/pdf-download
 *
 * Logs a PDF download (email + which asset) so sales can follow up and we can
 * see which one-pagers are most popular. Called fire-and-forget (often via
 * navigator.sendBeacon) from PdfDownloadLink — the client opens the PDF
 * regardless of the outcome here.
 *
 * Stored via the service-role client (RLS-protected table — see
 * supabase/migrations/20260603000000_pdf_downloads.sql).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generous — a single visitor may grab several one-pagers in a sitting.
const LIMIT = 40;
const WINDOW_SECONDS = 600;

function clean(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = consume(`pdf-dl:ip:${ip}`, LIMIT, WINDOW_SECONDS);
  // Silently accept when rate-limited — this is fire-and-forget telemetry.
  if (!rl.ok) return NextResponse.json({ ok: true }, { status: 202 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = clean(body.email, 200).toLowerCase();
  const pdf_key = clean(body.pdf_key, 120);
  if (!email || !EMAIL_RE.test(email) || !pdf_key) {
    return NextResponse.json({ error: "Missing email or pdf_key" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("pdf_downloads").insert([
    {
      email,
      name: clean(body.name, 120) || null,
      company_name: clean(body.company_name, 160) || null,
      pdf_key,
      pdf_label: clean(body.pdf_label, 160) || null,
      pdf_url: clean(body.pdf_url, 500) || null,
      source_path: clean(body.source_path, 200) || null,
      user_agent: clean(req.headers.get("user-agent"), 400) || null,
    },
  ]);

  if (error) {
    console.error("pdf_download insert failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
