'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Demo } from '@/lib/types';
import { trackDemoEvent } from '@/lib/track';
import { rememberDemoView } from '@/lib/recently-viewed';

/* ============================================================
   ECHELIX LOGO
   Source is a 1200×500 PNG. next/image auto-generates AVIF/WebP
   variants and serves whatever the visiting browser supports. We
   give it priority because the logo is above the fold on every page.
   ============================================================ */
export function EchelixLogo({ className = 'h-7' }: { className?: string }) {
  return (
    <Image
      src="/echelix-logo.png"
      alt="Echelix"
      width={1200}
      height={500}
      priority
      className={className}
      sizes="(max-width: 768px) 120px, 200px"
    />
  );
}

/* ============================================================
   NAV
   ============================================================ */
export function HubNav({ label, partner }: { label: string; partner?: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-1 md:py-1 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <EchelixLogo className="h-24 md:h-28 w-auto" />
        </a>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-grey-500 hidden md:block">
            {label}
          </span>
          {partner && (
            <span className="badge">
              <MicrosoftSquares className="w-2.5 h-2.5" />
              Microsoft Partner
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}

function SignOutButton() {
  async function handleSignOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      window.location.href = '/';
    }
  }
  return (
    <button
      onClick={handleSignOut}
      className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition"
      type="button"
    >
      Sign out
    </button>
  );
}

/* ============================================================
   PUBLIC NAV — used on /demo/[slug] pages.
   Adapts based on auth state: signed-in visitors see "Back to demos"
   pointing at their hub; anonymous visitors see "Sign in".
   ============================================================ */
export function PublicNav({ backHref }: { backHref?: string }) {
  const signedIn = !!backHref && backHref !== '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
        <a href={signedIn ? backHref! : '/'} className="flex items-center gap-3">
          <EchelixLogo className="h-24 md:h-28 w-auto" />
        </a>
        <div className="flex items-center gap-3 md:gap-4">
          {signedIn ? (
            <a href={backHref!} className="btn-ghost text-xs">
              ← Back to demos
            </a>
          ) : (
            <>
              <a
                href="/"
                className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition hidden md:inline"
              >
                All solutions
              </a>
              <a href="/" className="btn-pill text-xs">
                Sign in
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
export function HubFooter() {
  return (
    <footer className="border-t hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <EchelixLogo className="h-16 w-auto opacity-80" />
        <p className="text-xs text-grey-600">
          Modernize. Build Agentic Apps. Deliver Business Value.
        </p>
      </div>
    </footer>
  );
}

/* ============================================================
   MICROSOFT 4-SQUARE LOGO (inline SVG)
   ============================================================ */
export function MicrosoftSquares({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden="true">
      <rect width="10" height="10" fill="#f25022" />
      <rect x="11" width="10" height="10" fill="#7fba00" />
      <rect y="11" width="10" height="10" fill="#00a4ef" />
      <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

/* ============================================================
   SKELETON CARDS — shown while demos load
   ============================================================ */
export function DemoCardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-56 bg-gradient-to-br from-[#1a1f1d] to-[#0a0f0d]" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-20 rounded-full bg-milk/5" />
        <div className="h-6 w-3/4 rounded bg-milk/10" />
        <div className="h-3 w-full rounded bg-milk/5" />
        <div className="h-3 w-5/6 rounded bg-milk/5" />
        <div className="h-10 w-full rounded-full bg-milk/5 mt-3" />
      </div>
    </div>
  );
}

export function DemoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DemoCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ============================================================
   DEMO CARD
   ============================================================ */
export function DemoCard({
  demo,
  partner = false,
  featured = false,
}: {
  demo: Demo;
  partner?: boolean;
  featured?: boolean;
}) {
  const [iframeError, setIframeError] = useState(false);
  const router = useRouter();
  const detailHref = `/demo/${demo.slug}`;

  // Whole-tile click navigates to the detail subpage. Inner <a>/<button>
  // elements (Open Demo, Details link) have their own handlers — closest()
  // check makes sure we don't double-fire when those are clicked.
  function handleTileClick(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) return;
    router.push(detailHref);
  }
  function handleTileKey(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(detailHref);
    }
  }

  return (
    <article
      className={`card card-lift overflow-hidden flex flex-col cursor-pointer ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
      onClick={handleTileClick}
      onKeyDown={handleTileKey}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${demo.title}`}
    >
      <div
        className={`relative w-full overflow-hidden bg-gradient-to-br from-sage via-sage-dark to-[#020202] ${
          featured ? 'h-72' : 'h-56'
        }`}
      >
        {demo.preview_image_url && !iframeError ? (
          <Image
            src={demo.preview_image_url}
            alt={demo.title}
            fill
            sizes={featured ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover"
            unoptimized={demo.preview_image_url.startsWith('http')}
            onError={() => setIframeError(true)}
          />
        ) : demo.demo_url && !iframeError ? (
          <>
            <iframe
              src={demo.demo_url}
              className="demo-preview-frame"
              sandbox="allow-scripts"
              loading="lazy"
              title={`${demo.title} preview`}
              onError={() => setIframeError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-milk/80">
            <div className="text-3xl mb-2 font-serif">◆</div>
            <p className="text-[10px] uppercase tracking-[0.2em]">Demo Preview</p>
          </div>
        )}

        {featured && (
          <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-sea-foam text-black border border-sea-foam">
            ★ Featured
          </span>
        )}
        {!featured && demo.featured && (
          <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-sea-foam border border-sea-foam/30">
            ★ Featured
          </span>
        )}
        {partner && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-medium px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-milk border border-milk/20">
            <MicrosoftSquares className="w-2 h-2" />
            Co-Sell
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={demo.industry ? 'badge badge-sage' : 'badge badge-muted'}>
            {demo.industry || 'General'}
          </span>
        </div>

        <h3
          className={`font-serif text-milk leading-tight mb-3 ${
            featured ? 'text-3xl' : 'text-2xl'
          }`}
        >
          {demo.title}
        </h3>
        <p className="text-sm text-grey-400 line-clamp-3 mb-6 leading-relaxed">
          {demo.description || 'Interactive solution demonstration.'}
        </p>

        <div className="mt-auto flex items-center gap-3">
          {/* Internal nav — stays in-app, no new tab */}
          <a
            href={detailHref}
            className="btn-ghost text-xs flex-1"
            onClick={(e) => {
              e.stopPropagation();
              // Let Next.js handle the navigation; we use <a> for
              // right-click + middle-click + cmd-click support.
            }}
          >
            Details →
          </a>
          {/* External — opens demo in a new tab. Tracked. */}
          <a
            href={demo.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill text-xs flex-1"
            onClick={(e) => {
              e.stopPropagation();
              trackDemoEvent(demo.id, 'click');
              rememberDemoView(demo);
            }}
          >
            Open Demo →
          </a>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   ACCESSIBLE MODAL — ESC closes, focus trap, body scroll lock
   ============================================================ */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Capture the latest onClose in a ref so the effect below can depend
  // only on `open`. Without this, the parent passes a new arrow function
  // for onClose on every render — which caused the focus-stealing bug:
  // every keystroke inside the modal triggered the effect, which yanked
  // focus back to the first focusable element (the close button).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // ESC to close + body scroll lock + initial focus.
  // IMPORTANT: depend only on `open` so this fires exactly twice per
  // modal lifecycle (mount + unmount), not on every parent re-render.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
    }
    document.addEventListener('keydown', onKey);

    // Focus first focusable element inside the dialog
    const focusable = dialogRef.current?.querySelector<HTMLElement>(
      'input, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Trap focus within the dialog
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/80 backdrop-blur"
      onClick={onClose}
      onKeyDown={onKeyDown}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-milk/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
