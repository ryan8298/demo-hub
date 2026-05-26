/**
 * Client-side analytics dispatch. Fire-and-forget.
 *
 * Prefers navigator.sendBeacon when the page is unloading (e.g. user
 * clicked "Open Demo" which navigates to a new tab) — it's the only API
 * that guarantees delivery during navigation. Falls back to fetch with
 * keepalive for browsers that don't support sendBeacon.
 *
 * Errors are swallowed silently. Tracking is best-effort by design.
 */

export type DemoEvent = 'view' | 'click';

export function trackDemoEvent(demoId: string, event: DemoEvent): void {
  if (typeof window === 'undefined') return;
  if (!demoId) return;

  const url = `/api/demos/${demoId}/track`;
  const payload = JSON.stringify({ event });

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
    // Fallback for environments without sendBeacon
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never crash the UI
  }
}
