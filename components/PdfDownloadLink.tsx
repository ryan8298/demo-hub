'use client';

import { useState } from 'react';
import { Modal } from '@/components/HubShared';

/**
 * A download link that captures the visitor's email before opening a PDF.
 *
 * Behavior:
 *   - First download in this browser → an email-capture modal. On submit we
 *     remember the lead (localStorage), log the download, and open the PDF.
 *   - Subsequent downloads → we reuse the remembered email, log silently, and
 *     open the PDF immediately (no nag).
 *
 * Logging is best-effort (fire-and-forget): the PDF always opens even if the
 * /api/pdf-download call fails, so a logging hiccup never blocks a download.
 */
const LEAD_KEY = 'echelix.pdfLead.v1';

type Lead = { email: string; name?: string; company_name?: string };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readLead(): Lead | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v.email === 'string' ? v : null;
  } catch {
    return null;
  }
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

  function openPdf() {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }

  function logDownload(lead: Lead) {
    // Fire-and-forget. Never blocks the download.
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
    const lead = readLead();
    if (lead?.email) {
      openPdf();
      logDownload(lead);
      return;
    }
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
    const lead: Lead = {
      email,
      name: form.name.trim() || undefined,
      company_name: form.company_name.trim() || undefined,
    };
    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
    } catch {
      /* ignore */
    }
    openPdf(); // user gesture — open before any async work
    logDownload(lead);
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
