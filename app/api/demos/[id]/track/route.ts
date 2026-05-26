import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { consume, clientIp } from "@/lib/rate-limit";

// 100 track calls per IP per minute. Generous because a single hub
// pageview can fire multiple 'view' beacons as cards scroll into view.
const TRACK_LIMIT = 100;
const TRACK_WINDOW_SECONDS = 60;

type Metric = "view" | "click";
const VALID: ReadonlySet<Metric> = new Set(["view", "click"]);

/**
 * POST /api/demos/[id]/track
 *
 * Increments the view_count or click_count counter on a demo. Designed to
 * be called via navigator.sendBeacon() so it doesn't block page navigation.
 *
 * Counters live on the demos row itself (single integer per metric) —
 * we don't store per-event data. For per-user analytics, layer Vercel
 * Analytics or Sentry on top.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Rate limit per IP. We don't gate on auth — this fires for anonymous
  // visitors hitting public /demo/[slug] pages too.
  const ip = clientIp(req);
  const rl = consume(`track:ip:${ip}`, TRACK_LIMIT, TRACK_WINDOW_SECONDS);
  if (!rl.ok) {
    return NextResponse.json({ ok: true }, { status: 202 }); // silently swallow
  }

  let metric: Metric = "view";
  try {
    // sendBeacon serializes the body as a Blob — fetch with JSON body works too.
    const body = await req.json().catch(() => ({}));
    if (body?.event && VALID.has(body.event)) metric = body.event;
  } catch {
    // No body? Default to view.
  }

  const { error } = await supabaseAdmin.rpc("increment_demo_metric", {
    p_id: id,
    p_metric: metric,
  });

  if (error) {
    console.error("track increment failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
