/**
 * Shared session-cookie utilities.
 *
 * Both admin auth and visitor auth issue HMAC-signed cookies of the form:
 *
 *     <base64url(payload_json)>.<base64url(hmac_sha256)>
 *
 * Web Crypto is used so this works in the Node runtime AND in the Edge
 * runtime (Next.js middleware).
 *
 * The signing secret is read from SESSION_SECRET at call time. We do NOT
 * cache the imported CryptoKey because Edge runtime can recycle workers.
 */

export type SessionPayload = {
  sub: string; // subject — "admin" or the visitor's email
  role: "admin" | "visitor";
  exp: number; // unix seconds
  data?: Record<string, unknown>; // optional metadata (visitor profile)
};

function base64UrlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes =
    buf instanceof Uint8Array ? buf : new Uint8Array(buf as ArrayBuffer);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return base64UrlEncode(sig);
}

// Constant-time equality for two equal-length strings.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// Read from the validated env module. SESSION_SECRET length is enforced
// at module load (lib/env.ts), so by the time we get here it's guaranteed
// to be present and ≥32 chars on the server.
import { SESSION_SECRET } from "@/lib/env";

function getSecret(): string {
  return SESSION_SECRET;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const json = JSON.stringify(payload);
  const body = base64UrlEncode(new TextEncoder().encode(json));
  const sig = await hmac(getSecret(), body);
  return `${body}.${sig}`;
}

export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  let expectedSig: string;
  try {
    expectedSig = await hmac(getSecret(), body);
  } catch {
    return null;
  }
  if (!safeEqual(sig, expectedSig)) return null;

  let payload: SessionPayload;
  try {
    const json = new TextDecoder().decode(base64UrlDecode(body));
    payload = JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.exp !== "number" || Date.now() / 1000 > payload.exp)
    return null;
  return payload;
}

export const COOKIE_ADMIN = "echelix_admin";
export const COOKIE_VISITOR = "echelix_visitor";
export const ADMIN_TTL_SECONDS = 60 * 60 * 8; // 8 hours
export const VISITOR_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
