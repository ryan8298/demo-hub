'use client';

import { useEffect, useState } from 'react';

/**
 * Lightweight cookie notice banner. Wording is kept consistent with the
 * Privacy Policy and Cookie Policy (which cover performance, functionality,
 * and advertising cookies). We persist the dismissal in localStorage so it
 * shows once. Mounted globally from app/layout.tsx.
 */
const STORAGE_KEY = 'echelix_cookie_notice_v1';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  // Read the dismissal flag once on mount. We can't read localStorage in the
  // initial useState (it's unavailable during SSR), so this mount-time sync
  // from an external store is the intended pattern here.
  useEffect(() => {
    let dismissed = true;
    try {
      dismissed = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (private mode) — treat as dismissed, stay hidden.
    }
    if (!dismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* best effort */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-4 inset-x-4 md:left-auto md:right-6 md:max-w-md z-[90] rounded-2xl border border-milk/12 bg-[#0a0a0a]/95 backdrop-blur p-5 shadow-2xl"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-sage mb-2">Cookies</p>
      <p className="text-sm text-grey-300 leading-relaxed mb-4">
        We use cookies to run our sites, remember your choices, understand how
        our sites are used, and provide more relevant content and ads. See our{' '}
        <a href="/legal/cookies" className="text-sea-foam hover:underline">
          Cookie Policy
        </a>{' '}
        and{' '}
        <a href="/legal/privacy" className="text-sea-foam hover:underline">
          Privacy Policy
        </a>
        .
      </p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={dismiss} className="btn-pill text-xs">
          Got it
        </button>
        <a
          href="/legal/cookies"
          className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition"
        >
          Learn more
        </a>
      </div>
    </div>
  );
}
