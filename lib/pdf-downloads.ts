/**
 * Server-side data access for PDF download events. Service-role only — runs
 * in the admin console behind the admin gate. Never import into client code.
 */
import { supabaseAdmin } from "@/lib/supabase";

export interface PdfDownload {
  id: string;
  created_at: string;
  email: string;
  name: string | null;
  company_name: string | null;
  pdf_key: string;
  pdf_label: string | null;
  pdf_url: string | null;
  source_path: string | null;
  user_agent: string | null;
}

export interface PdfPopularity {
  pdf_key: string;
  pdf_label: string;
  downloads: number;
  uniqueEmails: number;
}

export async function listPdfDownloads(limit = 500): Promise<PdfDownload[]> {
  const { data, error } = await supabaseAdmin
    .from("pdf_downloads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("listPdfDownloads failed:", error.message);
    return [];
  }
  return (data ?? []) as PdfDownload[];
}

/** Aggregate downloads by asset for the "most popular" view. */
export function summarizePopularity(rows: PdfDownload[]): PdfPopularity[] {
  const map = new Map<string, { label: string; total: number; emails: Set<string> }>();
  for (const r of rows) {
    const entry = map.get(r.pdf_key) ?? {
      label: r.pdf_label || r.pdf_key,
      total: 0,
      emails: new Set<string>(),
    };
    entry.total += 1;
    entry.emails.add(r.email.toLowerCase());
    map.set(r.pdf_key, entry);
  }
  return Array.from(map.entries())
    .map(([pdf_key, v]) => ({
      pdf_key,
      pdf_label: v.label,
      downloads: v.total,
      uniqueEmails: v.emails.size,
    }))
    .sort((a, b) => b.downloads - a.downloads);
}
