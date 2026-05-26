/**
 * Tiny localStorage-backed "recently viewed" list of demos.
 *
 * Stored as a JSON array of demo IDs in newest-first order. Capped at
 * MAX_ITEMS to bound the storage. Client-only — no server roundtrip,
 * which makes it fast and avoids cookie bloat.
 */

import type { Demo } from "@/lib/types";

const KEY = "echelix.recentlyViewed.v1";
const MAX_ITEMS = 8;

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
    // Notify same-tab listeners — the `storage` event only fires cross-tab.
    window.dispatchEvent(new Event("echelix:recentlyViewed:changed"));
  } catch {
    // Quota exceeded, private browsing, etc. — silently ignore.
  }
}

export function getRecentlyViewedIds(): string[] {
  return readIds();
}

/** Move `demo.id` to the front. De-duplicates on insert. */
export function rememberDemoView(demo: { id: string }) {
  if (!demo?.id) return;
  const current = readIds();
  const next = [demo.id, ...current.filter((id) => id !== demo.id)];
  writeIds(next);
}

export function clearRecentlyViewed() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("echelix:recentlyViewed:changed"));
  } catch {
    // ignore
  }
}

/** Resolve the stored IDs against a list of demos, preserving order. */
export function pickRecentlyViewed(demos: Demo[]): Demo[] {
  const ids = readIds();
  const byId = new Map(demos.map((d) => [d.id, d] as const));
  const result: Demo[] = [];
  for (const id of ids) {
    const d = byId.get(id);
    if (d) result.push(d);
  }
  return result;
}
