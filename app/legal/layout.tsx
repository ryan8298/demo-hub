import { EchelixLogo } from '@/components/HubShared';
import { SiteFooter } from '@/components/SiteFooter';
import { LEGAL_LINKS } from '@/lib/site';

/**
 * Shared chrome for all /legal/* pages. Public (not gated by proxy.ts).
 * Minimal top nav back to the site, a left rail of policy links, and the
 * global footer.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-milk">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-16 md:h-20 w-auto" />
          </a>
          <a
            href="/"
            className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition"
          >
            ← Back to site
          </a>
        </div>
      </nav>

      <div className="max-w-[1100px] mx-auto px-6 md:px-8 pt-36 pb-16 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 md:gap-14">
        {/* Policy rail */}
        <aside className="md:sticky md:top-32 self-start">
          <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-4">
            Legal
          </p>
          <nav className="flex flex-col gap-3">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-grey-300 hover:text-sea-foam transition"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Document */}
        <article className="legal-doc max-w-2xl">{children}</article>
      </div>

      <SiteFooter showCta={false} />
    </div>
  );
}
