/**
 * Best-effort outbound email notifications via Resend.
 *
 * Used to ping the sales inbox when a new use-case pilot submission arrives.
 * This is intentionally fire-and-forget and NON-fatal: if RESEND_API_KEY is
 * not configured (e.g. local dev, or before the integration is set up), we
 * log and no-op so the submission still succeeds and lands in the DB + admin
 * inbox.
 *
 * Requires (optional) env:
 *   RESEND_API_KEY            — Resend API key
 *   RESEND_FROM               — verified sender, e.g. "Echelix <notifications@echelix.app>"
 *   SALES_NOTIFICATION_EMAIL  — recipient (defaults to sales@echelix.app via lib/site)
 */
import { COMPANY } from "@/lib/site";

const ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
}

export type PilotSubmissionEmail = {
  name: string;
  email: string;
  company_name?: string;
  industry?: string;
  use_case: string;
  current_pain?: string;
  desired_outcome?: string;
};

export async function sendPilotNotification(s: PilotSubmissionEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[notify] RESEND_API_KEY not set — skipping sales email (submission still stored).");
    return;
  }

  const from = process.env.RESEND_FROM || `Echelix Demo Hub <notifications@${COMPANY.domain}>`;
  const to = COMPANY.email.sales;

  const rows: [string, string | undefined][] = [
    ["Name", s.name],
    ["Email", s.email],
    ["Company", s.company_name],
    ["Industry", s.industry],
    ["Use case", s.use_case],
    ["Current pain", s.current_pain],
    ["Desired outcome", s.desired_outcome],
  ];
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#1A2B4A;max-width:640px">
      <h2 style="font-family:Georgia,serif">New use-case pilot submission</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;vertical-align:top;white-space:nowrap">${esc(
                k
              )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(
                v
              )}</td></tr>`
          )
          .join("")}
      </table>
      <p style="color:#6B5D4F;font-size:12px;margin-top:16px">Review and triage in the Echelix admin inbox.</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: s.email,
        subject: `New pilot use case — ${s.company_name || s.name}`,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[notify] Resend send failed:", res.status, text);
    }
  } catch (err) {
    console.error("[notify] Resend send threw:", err);
  }
}
