/**
 * Server-only helper to resolve the signed-in visitor's identity from the
 * session cookie. Used by the hub pages to pass `viewer` down so the one-pager
 * strip can log downloads in the background without prompting for email.
 *
 * Uses next/headers cookies(), so importing this opts a route into dynamic
 * (per-request) rendering — which is correct for the gated, personalized hubs.
 */
import { cookies } from "next/headers";
import { verifySession, COOKIE_VISITOR } from "@/lib/session";
import type { Viewer } from "@/components/PdfDownloadLink";

export async function getViewer(): Promise<Viewer | null> {
  const store = await cookies();
  const session = await verifySession(store.get(COOKIE_VISITOR)?.value);
  if (session?.role !== "visitor") return null;

  const d = (session.data ?? {}) as {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
  const name = [d.first_name, d.last_name].filter(Boolean).join(" ").trim();
  return {
    email: String(session.sub || ""),
    name: name || null,
    company_name: d.company_name || null,
  };
}
