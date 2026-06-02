'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/HubShared';

/**
 * A download link that captures who downloaded which PDF.
 *
 * Rules:
 *   - Signed-in visitor → no prompt. We attribute the download to their
 *     session identity and log it (every download is captured).
 *   - Anonymous visitor → an email-capture modal EVERY time. Each PDF needs
 *     its own email entry (no remembering); each entry is logged.
 *
 * Logging is best-effort: the PDF always opens even if /api/pdf-download
 * fails.
 */

type Lead = { email: string; name?: string | null; company_name?: string | null };
type Visitor = { authenticated: boolean; email?: string; name?: string | null; company_name?: string | null };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared, memoized so all links on a page make a single /api/me call.
let visitorPromise: Promise<Visitor> | null = null;
function getVisitor(): Promise<Visitor> {
  if (!visitorPromise) {
    visitorPromise = fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .catch(() => ({ authenticated: false }));
  }
  return visitorPromise;
}

export function PdfDownloadLink({
  pdfKey,
  pdfLabel,
  pdfUrl,
  className = '',
  children,
}: {
  pdfKey: string;
  pdfLabel: string;
  pdfUrl: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company_name: '' });
  const [error, setError] = useState('');
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  // Resolve auth state up-front so the click handler can open the PDF
  // synchronously (no async before window.open → no popup blocking).
  useEffect(() => {
    let alive = true;
    getVisitor().then((v) => {
      if (alive) setVisitor(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  function openPdf() {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
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
    // Signed-in visitor → attribute to their identity, no prompt.
    if (visitor?.authenticated && visitor.email) {
      openPdf();
      logDownload({
        email: visitor.email,
        name: visitor.name ?? null,
        company_name: visitor.company_name ?? null,
      });
      return;
    }
    // Anonymous → prompt every time.
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
