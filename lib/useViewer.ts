'use client';

import { useEffect, useState } from 'react';

/**
 * Client hook that reports whether the current visitor is signed in, by
 * reading the httpOnly session via /api/me. Returns null while loading so
 * callers can avoid a flash of the wrong auth state.
 */
export type ViewerState = {
  authenticated: boolean;
  email?: string;
  name?: string | null;
  company_name?: string | null;
  isMicrosoft?: boolean;
} | null;

export function useViewer(): ViewerState {
  const [viewer, setViewer] = useState<ViewerState>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/me', { cache: 'no-store', credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setViewer(d);
      })
      .catch(() => {
        if (alive) setViewer({ authenticated: false });
      });
    return () => {
      alive = false;
    };
  }, []);

  return viewer;
}

export function hubHrefFor(viewer: ViewerState): string {
  return viewer?.isMicrosoft ? '/microsoft/hub' : '/customer/hub';
}
