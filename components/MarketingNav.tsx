'use client';

import { EchelixLogo } from '@/components/HubShared';
import { BookCallButton } from '@/components/BookCall';

/**
 * Top navigation for the public marketing pages (landing + /offerings).
 * Holds the primary tabs the user asked to surface: Offerings, Submit a use
 * case, Book a discovery call, and Sign in.
 *
 * Sign-in is delegated to the parent (which owns the SignInModal) via
 * onSignIn. Book-a-call is self-contained (BookCallButton owns its modal).
 */
export function MarketingNav({ onSignIn }: { onSignIn: () => void }) {
  const linkClass =
    'text-[11px] uppercase tracking-[0.2em] text-grey-300 hover:text-sea-foam transition';

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
          <BookCallButton
            label="Book a call"
            variant="link"
            className="hidden md:inline"
          />
          <span className="hidden md:inline-block w-px h-3 bg-milk/15" />
          <button type="button" onClick={onSignIn} className="btn-pill">
            Sign in
          </button>
        </div>
      </div>
    </nav>
  );
}
