import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

/**
 * Invalidate the ISR caches for the hub pages and the public demo page
 * so admin edits show up immediately instead of waiting 60s.
 */
function bustHubCaches(slug?: string) {
  revalidatePath("/customer/hub");
  revalidatePath("/microsoft/hub");
  if (slug) revalidatePath(`/demo/${slug}`);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { data, error } = await supabaseAdmin
      .from("demos")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Demo not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: `Demo lookup failed: ${err.message || "unknown"}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin(request);
  if (unauth) return unauth;

  const { id } = await params;
  try {
    const body = await request.json();

    // .select() (without .single()) returns the array of updated rows.
    // .maybeSingle() throws "cannot coerce" if the returning array is
    // empty — which can happen when RLS hides the row from service_role.
    // Returning the array and asserting length manually gives a clearer
    // error.
    const { data, error } = await supabaseAdmin
      .from("demos")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "Demo updated but no row returned — usually means service_role can't SELECT the row. Apply the service_role table policies migration in Supabase.",
        },
        { status: 500 }
      );
    }

    bustHubCaches(data[0]?.slug);
    return NextResponse.json(data[0]);
  } catch (error) {
    const err = error as {
      message?: string;
      code?: string;
      hint?: string;
      details?: string;
    };
    console.error("Error updating demo:", err);
    return NextResponse.json(
      {
        error: `Failed to update demo: ${err.message || "Unknown error"}`,
        detail: { code: err.code, hint: err.hint, details: err.details },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin(request);
  if (unauth) return unauth;

  const { id } = await params;
  try {
    // Look up the slug first so we can revalidate the public detail page.
    const { data: existing } = await supabaseAdmin
      .from("demos")
      .select("slug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabaseAdmin.from("demos").delete().eq("id", id);
    if (error) throw error;

    bustHubCaches(existing?.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as { message?: string };
    console.error("Error deleting demo:", err);
    return NextResponse.json(
      { error: `Failed to delete demo: ${err.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
