/**
 * Decides whether an email address is allowed into the Microsoft Partner hub.
 *
 * In production, this is just `@microsoft.com`. For testing, set the
 * MICROSOFT_TEST_EMAILS env var to a comma-separated list of:
 *
 *   • exact emails:  `ryan@echelix.app,partner@example.com`
 *   • whole domains: `@echelix.app,@partner.test`
 *   • mixed:         `@echelix.app,bob@another.com`
 *
 * Empty / unset env var = no override, production behavior.
 *
 * Edge-runtime compatible (only reads process.env, no fs/network).
 */
export function isMicrosoftEmail(email: string): boolean {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized.includes("@")) return false;

  // Production rule
  if (normalized.endsWith("@microsoft.com")) return true;

  // Test allowlist
  const raw = process.env.MICROSOFT_TEST_EMAILS || "";
  if (!raw) return false;

  const entries = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  for (const entry of entries) {
    if (entry.startsWith("@")) {
      // domain entry — match any email under that domain
      if (normalized.endsWith(entry)) return true;
    } else {
      // exact email entry
      if (normalized === entry) return true;
    }
  }

  return false;
}
