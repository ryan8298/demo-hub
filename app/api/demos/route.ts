import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get("audience") || "customer";

    // Filter at the database. `audience` is a text[] column — `contains`
    // returns rows whose array includes every element of the given array.
    const { data, error } = await supabase
      .from("demos")
      .select("*")
      .contains("audience", [audience])
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Edge cache the response. s-maxage tells Vercel to serve cached
    // responses for 60s; stale-while-revalidate lets it serve a stale
    // response while it refreshes in the background. Net effect: with 50
    // concurrent users, Supabase sees ~1 query per minute instead of 50.
    return NextResponse.json(data ?? [], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching demos:", error);
    return NextResponse.json(
      { error: "Failed to fetch demos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Cookie-based admin auth. No more X-Admin-Key header, no more
  // NEXT_PUBLIC_ADMIN_API_KEY in the client bundle.
  const unauth = await requireAdmin(request);
  if (unauth) return unauth;

  try {
    const body = await request.json();
    const {
      title,
      description,
      demo_url,
      slug,
      audience,
      roi_summary,
      industry,
      preview_image_url,
      tags,
      problem_statement,
      target_audience_description,
      architecture_diagram_url,
    } = body;

    if (!title || !demo_url || !slug || !audience || audience.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Writes go through the service-role client. With RLS enabled (step 3)
    // the anon client cannot insert at all — only the service role can.
    const { data, error } = await supabaseAdmin
      .from("demos")
      .insert([
        {
          title,
          description: description || null,
          demo_url,
          slug,
          audience,
          roi_summary: roi_summary || null,
          industry: industry || null,
          preview_image_url: preview_image_url || null,
          tags: Array.isArray(tags) ? tags : [],
          problem_statement: problem_statement || null,
          target_audience_description: target_audience_description || null,
          architecture_diagram_url: architecture_diagram_url || null,
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Supabase's PostgrestError carries message + code + hint + details
    const err = error as {
      message?: string;
      code?: string;
      hint?: string;
      details?: string;
    };
    console.error("Error creating demo:", err);
    return NextResponse.json(
      {
        error: `Failed to create demo: ${err.message || "Unknown error"}`,
        detail: {
          code: err.code,
          hint: err.hint,
          details: err.details,
        },
      },
      { status: 500 }
    );
  }
}
