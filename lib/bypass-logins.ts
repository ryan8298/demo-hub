/**
 * Magic-email bypass logins for live demos.
 *
 * Entering one of these emails on the landing modal skips the OTP flow
 * entirely — no verification email, no first-name/last-name/company
 * fields required. Useful for rapid live demonstrations where the
 * fewer clicks the better.
 *
 * SECURITY NOTE
 * These are hardcoded shared "passwords" disguised as emails. Anyone
 * who learns them gets the corresponding access. Don't surface them
 * in marketing copy or share publicly. If they ever leak, rotate by
 * editing this file.
 *
 * Used by:
 *   • lib/microsoft-access.ts (so microsoft@echelix.com is treated as
 *     a Microsoft visitor by the proxy hub-gate)
 *   • app/api/auth/bypass-login/route.ts (issues the cookie)
 *   • app/page.tsx (detects bypass emails in the landing modal and
 *     reshapes the form to skip name/company fields)
 *
 * Pure data + pure functions — edge-runtime safe.
 */

export type BypassLogin = {
  /** Cookie type to set */
  role: "visitor" | "admin";
  /** Where to redirect after sign-in */
  redirect: string;
  /** For visitors only — flags whether the Microsoft hub gate accepts them */
  is_microsoft?: boolean;
  /** Pretty label shown in the modal hint */
  label: string;
};

export const BYPASS_LOGIN_MAP: Record<string, BypassLogin> = {
  "client@echelix.com": {
    role: "visitor",
    is_microsoft: false,
    redirect: "/customer/hub",
    label: "Customer Hub",
  },
  "microsoft@echelix.com": {
    role: "visitor",
    is_microsoft: true,
    redirect: "/microsoft/hub",
    label: "Microsoft Partner Hub",
  },
  "admin@echelix.com": {
    role: "admin",
    redirect: "/admin",
    label: "Admin Console",
  },
};

export function normalizeEmail(email: string): string {
  return String(email || "").trim().toLowerCase();
}

export function isBypassEmail(email: string): boolean {
  return normalizeEmail(email) in BYPASS_LOGIN_MAP;
}

export function getBypassLogin(email: string): BypassLogin | null {
  return BYPASS_LOGIN_MAP[normalizeEmail(email)] ?? null;
}
