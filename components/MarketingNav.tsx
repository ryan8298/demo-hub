'use client';

import { EchelixLogo } from '@/components/HubShared';
import { BookCallButton } from '@/components/BookCall';
import { useViewer, hubHrefFor } from '@/lib/useViewer';

/**
 * Top navigation for the public marketing pages (landing, /offerings, /pilot).
 * Tabs: Offerings, Submit a use case, Book a discovery call.
 *
 * The right side reflects auth state so a signed-in visitor sees the same
 * thing everywhere (no "you look signed out" surprise when leaving the hub):
 *   - signed in  → "Demo Hub" link + "Sign out"
 *   - signed out → "Sign in" (delegated to the parent's SignInModal)
 */
export function MarketingNav({ onSignIn }: { onSignIn: () => void }) {
  const viewer = useViewer();

  const linkClass =
    'text-[11px] uppercase tracking-[0.2em] text-grey-300 hover:text-sea-foam transition';

  async function signOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      window.location.href = '/';
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-1 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 shrink-0">
          <EchelixLogo className="h-20 md:h-24 w-auto" />
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <a href="/offerings" className={`${linkClass} hidden sm:inline`}>
            Offerings
          </a>
          <a href="/pilot" className={`${linkClass} hidden sm:inline`}>
            Submit a use case
          </a>
          <BookCallButton label="Book a call" variant="link" className="hidden md:inline" />
          <span className="hidden md:inline-block w-px h-3 bg-milk/15" />

          {/* Auth-aware: only render once /api/me resolves to avoid a flash. */}
          {viewer == null ? (
            <span className="w-[64px]" aria-hidden />
          ) : viewer.authenticated ? (
            <>
              <a href={hubHrefFor(viewer)} className={`${linkClass} hidden sm:inline`}>
                Demo Hub
              </a>
              <button type="button" onClick={signOut} className="btn-pill">
                Sign out
              </button>
            </>
          ) : (
            <button type="button" onClick={onSignIn} className="btn-pill">
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
