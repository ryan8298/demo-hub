'use client';

import { useState } from 'react';
import { Modal } from '@/components/HubShared';
import { BOOKINGS_URL, COMPANY } from '@/lib/site';

/**
 * Book-a-discovery-call CTA.
 *
 * Renders a button that opens an in-app modal embedding the Outlook Bookings
 * page in an iframe (per product decision). Microsoft Bookings pages allow
 * framing, but if NEXT_PUBLIC_BOOKINGS_URL is unset — or the embed is blocked
 * — we degrade gracefully to a mailto + "open in new tab" fallback so the CTA
 * is never a dead end.
 *
 * `variant` controls the button styling so the same component can sit in a
 * hero ("pill"), inline ("ghost"), or footer ("link") context.
 */
export function BookCallButton({
  label = 'Book a discovery call',
  variant = 'pill',
  className = '',
}: {
  label?: string;
  variant?: 'pill' | 'ghost' | 'link';
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const base =
    variant === 'pill'
      ? 'btn-pill'
      : variant === 'ghost'
        ? 'btn-ghost'
        : 'text-xs uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition';

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${base} ${className}`}>
        {label}
      </button>
      <BookCallModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function BookCallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const hasUrl = !!BOOKINGS_URL;

  return (
    <Modal open={open} onClose={onClose} labelledBy="bookcall-title" size="lg" fill>
      {/* Header — fixed height, never scrolls */}
      <div className="relative shrink-0 p-6 md:p-8 pb-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-milk/15 flex items-center justify-center text-milk/60 hover:text-sea-foam hover:border-sea-foam transition z-10"
          aria-label="Close"
        >
          ✕
        </button>

        <p className="text-xs uppercase tracking-[0.25em] text-sage mb-3">
          Talk to us
        </p>
        <h2 id="bookcall-title" className="font-serif text-3xl text-milk mb-2 leading-tight">
          Book a discovery call.
        </h2>
        <p className="text-sm text-grey-400">
          Pick a time that works for you — we&apos;ll walk through your use case and
          where an Echelix agentic solution fits.
        </p>
      </div>

      {/* Body — flexes to fill remaining height so the dialog stays capped at
          92vh and centered. The iframe fills whatever space is left. */}
      <div className="flex-1 min-h-0 flex flex-col px-6 md:px-8 pb-6 md:pb-8">
        {hasUrl ? (
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-milk/10 bg-white">
            <iframe
              src={BOOKINGS_URL}
              title="Book a discovery call with Echelix"
              className="w-full h-full"
              style={{ border: 0, minHeight: 320 }}
            />
          </div>
        ) : (
          <div className="p-5 rounded-xl border border-milk/10 bg-white/[0.03] text-sm text-grey-300 leading-relaxed">
            <p className="mb-4">
              Our online scheduler isn&apos;t connected yet. Email us and we&apos;ll
              get a time on the calendar right away.
            </p>
            <a href={`mailto:${COMPANY.email.sales}?subject=Discovery%20call%20request`} className="btn-pill">
              Email {COMPANY.email.sales} →
            </a>
          </div>
        )}

        {hasUrl && (
          <p className="text-center mt-3 shrink-0">
            <a
              href={BOOKINGS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] text-grey-500 hover:text-sea-foam transition"
            >
              Trouble loading? Open the scheduler in a new tab ↗
            </a>
          </p>
        )}
      </div>
    </Modal>
  );
}
