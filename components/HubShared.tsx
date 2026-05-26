'use client';

import { useEffect, useRef, useState } from 'react';
import { Demo } from '@/lib/types';

/* ============================================================
   ECHELIX LOGO
   ============================================================ */
export function EchelixLogo({ className = 'h-7' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/echelix-logo.png"
      alt="Echelix"
      width={1200}
      height={500}
      className={className}
      decoding="async"
      loading="eager"
    />
  );
}

/* ============================================================
   NAV
   ============================================================ */
export function HubNav({ label, partner }: { label: string; partner?: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <EchelixLogo className="h-8 md:h-9 w-auto" />
        </a>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#706A6B] hidden md:block">
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
      className="text-[10px] uppercase tracking-[0.25em] text-[#8B8586] hover:text-[#B2EEDA] transition"
      type="button"
    >
      Sign out
    </button>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
export function HubFooter() {
  return (
    <footer className="border-t hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <EchelixLogo className="h-6 w-auto opacity-80" />
        <p className="text-xs text-[#605A5B]">
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
        <div className="h-4 w-20 rounded-full bg-[#F3F3E9]/5" />
        <div className="h-6 w-3/4 rounded bg-[#F3F3E9]/10" />
        <div className="h-3 w-full rounded bg-[#F3F3E9]/5" />
        <div className="h-3 w-5/6 rounded bg-[#F3F3E9]/5" />
        <div className="h-10 w-full rounded-full bg-[#F3F3E9]/5 mt-3" />
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
  expanded,
  onToggle,
  partner = false,
  featured = false,
}: {
  demo: Demo;
  expanded: boolean;
  onToggle: () => void;
  partner?: boolean;
  featured?: boolean;
}) {
  const [iframeError, setIframeError] = useState(false);

  // Make the entire tile a click target for expand/collapse, but allow
  // anchors and explicit buttons inside to fire their own handlers.
  function handleTileClick(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) return;
    onToggle();
  }
  function handleTileKey(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <article
      className={`card card-lift overflow-hidden flex flex-col cursor-pointer ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
      onClick={handleTileClick}
      onKeyDown={handleTileKey}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <div
        className={`relative w-full overflow-hidden bg-gradient-to-br from-[#7FAC9D] via-[#5F8A7C] to-[#020202] ${
          featured ? 'h-72' : 'h-56'
        }`}
      >
        {demo.preview_image_url && !iframeError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={demo.preview_image_url}
            alt={demo.title}
            className="w-full h-full object-cover"
            loading="lazy"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F3F3E9]/80">
            <div className="text-3xl mb-2 font-serif">◆</div>
            <p className="text-[10px] uppercase tracking-[0.2em]">Demo Preview</p>
          </div>
        )}

        {featured && (
          <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-[#B2EEDA] text-black border border-[#B2EEDA]">
            ★ Featured
          </span>
        )}
        {!featured && demo.featured && (
          <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[#B2EEDA] border border-[#B2EEDA]/30">
            ★ Featured
          </span>
        )}
        {partner && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-medium px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[#F3F3E9] border border-[#F3F3E9]/20">
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
          className={`font-serif text-[#F3F3E9] leading-tight mb-3 ${
            featured ? 'text-3xl' : 'text-2xl'
          }`}
        >
          {demo.title}
        </h3>
        <p className="text-sm text-[#8B8586] line-clamp-3 mb-6 leading-relaxed">
          {demo.description || 'Interactive solution demonstration.'}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <a
            href={demo.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill text-xs flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            Open Demo →
          </a>
          <span
            className="btn-ghost text-xs pointer-events-none select-none"
            aria-hidden="true"
          >
            {expanded ? 'Hide' : 'Details'}
          </span>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t hairline space-y-5">
            {demo.roi_summary && (
              <div className="p-4 rounded-lg bg-[#B2EEDA]/5 border border-[#B2EEDA]/15">
                <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B2EEDA] mb-2">
                  ROI Summary
                </h4>
                <p className="text-sm text-[#F3F3E9] leading-relaxed">{demo.roi_summary}</p>
              </div>
            )}

            {demo.deployment_timeline && demo.deployment_timeline.length > 0 && (
              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#7FAC9D] mb-3">
                  Implementation Timeline
                </h4>
                <div className="space-y-3">
                  {demo.deployment_timeline.map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B2EEDA] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#F3F3E9]">{phase.phase}</span>
                        <span className="text-[#8B8586]"> — {phase.duration}</span>
                        {phase.details && (
                          <p className="text-xs text-[#706A6B] mt-1 leading-relaxed">{phase.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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

  // ESC to close + body scroll lock + initial focus
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
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
  }, [open, onClose]);

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
        className="relative w-full max-w-md bg-[#0a0a0a] border border-[#F3F3E9]/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
