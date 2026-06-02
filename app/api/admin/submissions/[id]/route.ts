import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";
import { SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/submissions";

/**
 * PATCH /api/admin/submissions/[id]  — update a submission's triage status
 *                                       and/or admin notes. Admin only.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;

  const { id } = await params;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const update: { status?: SubmissionStatus; admin_notes?: string } = {};

  if (typeof body.status === "string") {
    if (!SUBMISSION_STATUSES.includes(body.status as SubmissionStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status as SubmissionStatus;
  }
  if (typeof body.admin_notes === "string") {
    update.admin_notes = body.admin_notes.slice(0, 5000);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("use_case_submissions")
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("submission update failed:", error.message);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
