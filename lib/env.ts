/**
 * Centralized environment-variable validation.
 *
 * Behavior:
 *   • In production (Vercel deploys): missing required vars throw with a
 *     helpful message that mentions .env.example and Vercel settings —
 *     instead of failing 30 layers deep inside a Supabase call.
 *   • In development / local builds: missing vars log a one-time warning
 *     and resolve to empty strings, so a partial .env.local doesn't block
 *     `npm run build`.
 *
 * Client bundles never see SUPABASE_SERVICE_KEY / ADMIN_PASSWORD /
 * SESSION_SECRET — those are server-only by definition.
 */

const isProd = process.env.NODE_ENV === "production" && !!process.env.VERCEL;
const isBrowser = typeof window !== "undefined";
const warned = new Set<string>();

function read(
  key: string,
  opts?: { minLength?: number; serverOnly?: boolean }
): string {
  // Server-only vars are always undefined in client bundles by design.
  if (opts?.serverOnly && isBrowser) return "";

  const value = process.env[key];
  if (!value) {
    if (isProd) {
      throw new Error(
        `[Echelix] Missing required env var "${key}". See .env.example.\n` +
          `If running on Vercel, add it under Settings → Environment Variables and redeploy.`
      );
    }
    if (!warned.has(key)) {
      warned.add(key);
      // eslint-disable-next-line no-console
      console.warn(
        `[Echelix] env var "${key}" is not set — using empty fallback (dev only).`
      );
    }
    return "";
  }
  if (opts?.minLength && value.length < opts.minLength) {
    if (isProd) {
      throw new Error(
        `[Echelix] env var "${key}" is too short — need at least ${opts.minLength} characters.`
      );
    }
  }
  return value;
}

// ---- Public (browser + server) ----
export const NEXT_PUBLIC_SUPABASE_URL = read("NEXT_PUBLIC_SUPABASE_URL");
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = read("NEXT_PUBLIC_SUPABASE_ANON_KEY");

// ---- Server-only ----
export const SUPABASE_SERVICE_KEY = read("SUPABASE_SERVICE_KEY", {
  serverOnly: true,
});
export const ADMIN_PASSWORD = read("ADMIN_PASSWORD", { serverOnly: true });
export const SESSION_SECRET = read("SESSION_SECRET", {
  serverOnly: true,
  minLength: 32,
});

// ---- Optional ----
export const MICROSOFT_TEST_EMAILS = process.env.MICROSOFT_TEST_EMAILS || "";
