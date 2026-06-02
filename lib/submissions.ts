/**
 * Server-side data access for use-case pilot submissions. Service-role only
 * — these helpers run in admin Server Components / route handlers behind the
 * admin gate. Never import into client code.
 */
import { supabaseAdmin } from "@/lib/supabase";

export type SubmissionStatus =
  | "new"
  | "reviewing"
  | "accepted"
  | "declined"
  | "archived";

export interface UseCaseSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company_name: string | null;
  industry: string | null;
  use_case: string;
  current_pain: string | null;
  desired_outcome: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  source_path: string | null;
  user_agent: string | null;
}

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "new",
  "reviewing",
  "accepted",
  "declined",
  "archived",
];

export async function listSubmissions(): Promise<UseCaseSubmission[]> {
  const { data, error } = await supabaseAdmin
    .from("use_case_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listSubmissions failed:", error.message);
    return [];
  }
  return (data ?? []) as UseCaseSubmission[];
}
