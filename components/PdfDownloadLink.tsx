'use client';

import { useState } from 'react';
import { Modal } from '@/components/HubShared';

/**
 * A download link that captures who downloaded which PDF.
 *
 * Two deterministic modes (decided by the rendering surface, not by a
 * client-read cookie):
 *
 *   - Public pages (default, hub=false): an email-capture modal on EVERY
 *     download. Each PDF needs its own email entry.
 *   - Gated hub (hub=true): NO prompt. The signed-in viewer's identity is
 *     passed in from the server, so we log the download in the background.
 *     (If no viewer — e.g. an admin previewing — we just open the PDF.)
 *
 * Logging is best-effort: the PDF always opens even if /api/pdf-download fails.
 */

export type Viewer = { email: string; name?: string | null; company_name?: string | null };
type Lead = Viewer;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PdfDownloadLink({
  pdfKey,
  pdfLabel,
  pdfUrl,
  className = '',
  children,
  hub = false,
  viewer = null,
}: {
  pdfKey: string;
  pdfLabel: string;
  pdfUrl: string;
  className?: string;
  children: React.ReactNode;
  /** Rendered inside the gated hub → never prompt; attribute to `viewer`. */
  hub?: boolean;
  /** The signed-in visitor's identity (hub only), supplied by the server. */
  viewer?: Viewer | null;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company_name: '' });
  const [error, setError] = useState('');

  function openPdf() {
    // Open via a programmatically-clicked anchor rather than window.open with
    // a features string — the latter is treated as a popup and silently killed
    // by popup blockers (the PDF just never opens). A real <a target="_blank">
    // click is a legitimate user-initiated navigation that browsers allow.
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function logDownload(lead: Lead) {
    try {
      const body = JSON.stringify({
        ...lead,
        pdf_key: pdfKey,
        pdf_label: pdfLabel,
        pdf_url: pdfUrl,
        source_path: typeof location !== 'undefined' ? location.pathname : undefined,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/pdf-download', new Blob([body], { type: 'application/json' }));
      } else {
        void fetch('/api/pdf-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (hub) {
      // Gated hub: open immediately, log in the background, never prompt.
      openPdf();
      if (viewer?.email) {
        logDownload({
          email: viewer.email,
          name: viewer.name ?? null,
          company_name: viewer.company_name ?? null,
        });
      }
      return;
    }
    // Public pages: prompt for email every time.
    setError('');
    setForm({ name: '', email: '', company_name: '' });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid work email.');
      return;
    }
    openPdf(); // user gesture — open before any async work
    logDownload({
      email,
      name: form.name.trim() || null,
      company_name: form.company_name.trim() || null,
    });
    setOpen(false);
  }

  return (
    <>
      <a href={pdfUrl} onClick={handleClick} className={className}>
        {children}
      </a>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="pdf-dl-title">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-milk/15 flex items-center justify-center text-milk/60 hover:text-sea-foam hover:border-sea-foam transition"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="text-xs uppercase tracking-[0.25em] text-sage mb-3">One-pager</p>
        <h2 id="pdf-dl-title" className="font-serif text-2xl text-milk mb-2 leading-tight">
          Get the {pdfLabel} one-pager.
        </h2>
        <p className="text-sm text-grey-400 mb-5">
          Tell us where to reach you and the PDF opens right away.
        </p>

        {error && (
          <div role="alert" className="p-3 mb-3 rounded-lg text-xs bg-error/10 text-error border border-error/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Work email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              autoComplete="name"
              placeholder="Name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
            <input
              type="text"
              autoComplete="organization"
              placeholder="Company (optional)"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-pill w-full mt-1">
            Open the PDF →
          </button>
        </form>

        <p className="text-center text-[10px] uppercase tracking-[0.2em] mt-4 text-grey-600">
          Handled per our{' '}
          <a href="/legal/privacy" className="text-grey-400 hover:text-sea-foam transition">
            Privacy Policy
          </a>
          .
        </p>
      </Modal>
    </>
  );
}
