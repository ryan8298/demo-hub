'use client';

import { EchelixLogo } from '@/components/HubShared';
import { BookCallButton } from '@/components/BookCall';
import { COMPANY, LEGAL_LINKS, catalogPdfFor } from '@/lib/site';

/**
 * Global site footer. Replaces the old logo-only HubFooter and is the home
 * for the conversion CTAs (book a call, submit an idea, download catalog)
 * and the legally-required policy links.
 *
 * `audience` selects which catalog PDF the "Download catalog" link points at
 * (customer vs. co-sell). Omit on neutral pages (landing, legal) to default
 * to the customer catalog.
 */
export function SiteFooter({
  audience = 'customer',
  showCatalog = true,
}: {
  audience?: 'customer' | 'microsoft';
  showCatalog?: boolean;
}) {
  const catalogUrl = catalogPdfFor(audience);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t hairline mt-20">
      {/* CTA band */}
      <div className="border-b hairline bg-white/[0.015]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sage mb-3">
              Ready when you are
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-milk leading-tight max-w-xl">
              See what an agentic solution looks like for your operation.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <BookCallButton />
            <a href="/pilot" className="btn-ghost">
              Submit a use case →
            </a>
            {showCatalog && catalogUrl && (
              <a
                href={catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                ↓ Catalog (PDF)
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Lower footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-3">
          <EchelixLogo className="h-14 w-auto opacity-80" />
          <p className="text-xs text-grey-600">{COMPANY.tagline}</p>
          <p className="text-[10px] text-grey-700">
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
        </div>

        <nav
          aria-label="Legal"
          className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end"
        >
          {LEGAL_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`mailto:${COMPANY.email.general}`}
            className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
