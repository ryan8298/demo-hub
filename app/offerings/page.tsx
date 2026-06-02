'use client';

import { useState } from 'react';
import { MarketingNav } from '@/components/MarketingNav';
import { SignInModal } from '@/components/SignInModal';
import { SiteFooter } from '@/components/SiteFooter';
import { BookCallButton } from '@/components/BookCall';
import { OnePagersSection } from '@/components/OnePagersSection';
import { OFFERINGS, type Offering } from '@/lib/offerings';

export default function OfferingsPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const openSignIn = () => setShowSignIn(true);

  const featured = OFFERINGS.filter((o) => o.featured);
  const rest = OFFERINGS.filter((o) => !o.featured);

  return (
    <div className="min-h-screen text-milk">
      <MarketingNav onSignIn={openSignIn} />

      {/* Hero */}
      <header className="bg-wave relative pt-40 pb-16 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            Offerings
          </p>
          <h1 className="editorial font-serif text-[clamp(2.5rem,6vw,5rem)] text-milk leading-[1.04] mb-6 max-w-4xl">
            Ways to work with <em className="text-sea-foam not-italic">Echelix</em>.
          </h1>
          <p className="text-base md:text-lg text-grey-300 max-w-2xl leading-relaxed mb-8">
            From a fixed-fee pilot to the secure Azure foundation underneath it —
            every engagement is built on the same agentic architecture you can
            explore live in the demo hub.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={openSignIn} className="btn-pill">
              Sign in to view live demos →
            </button>
            <BookCallButton variant="ghost" />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16 space-y-6">
        {/* Featured (full-width, with timeline) */}
        {featured.map((o) => (
          <FeaturedOfferingCard key={o.slug} offering={o} />
        ))}

        {/* The rest — two wider cards (Lattice + Cortex) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((o) => (
            <OfferingCard key={o.slug} offering={o} />
          ))}
        </div>

        {/* Industry one-pagers — downloadable PDFs */}
        <OnePagersSection className="pt-6" />

        {/* Closing CTA */}
        <section className="mt-10">
          <div className="card p-8 md:p-12 border-l-2 border-sea-foam/40 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-4">
              See it before you scope it
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-milk leading-tight mb-4 max-w-2xl mx-auto">
              Explore the live demos, then let&apos;s talk.
            </h2>
            <p className="text-sm md:text-base text-grey-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Sign in to walk through every Echelix solution hands-on, or book a
              call and we&apos;ll map the right engagement to your environment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={openSignIn} className="btn-pill">
                Sign in to view live demos →
              </button>
              <BookCallButton variant="ghost" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter showCta={false} />

      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}

function PriceTag({ offering, large = false }: { offering: Offering; large?: boolean }) {
  return (
    <div className="text-right shrink-0">
      <div
        className={`font-serif text-milk leading-none ${large ? 'text-5xl' : 'text-3xl'}`}
      >
        {offering.price}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mt-2">
        {offering.priceNote}
      </div>
    </div>
  );
}

function FeaturedOfferingCard({ offering }: { offering: Offering }) {
  return (
    <article className="card p-8 md:p-10 border-l-2 border-sea-foam/50">
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sea-foam">
            Flagship
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-milk leading-tight mt-2">
            {offering.name}
          </h2>
        </div>
        <PriceTag offering={offering} large />
      </div>

      <p className="text-sm md:text-base text-grey-300 leading-relaxed max-w-2xl mb-8">
        {offering.tagline}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bullets */}
        <ul className="space-y-3">
          {offering.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm text-grey-200 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-sea-foam mt-2 flex-shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Timeline */}
        {offering.timeline && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
              How the pilot runs
            </p>
            <ol className="space-y-3">
              {offering.timeline.map((s) => (
                <li key={s.when} className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-sage w-20 shrink-0">
                    {s.when}
                  </span>
                  <span className="text-sm text-milk">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {offering.cta && (
        <div className="mt-8 pt-6 border-t hairline">
          <a href={offering.cta.href} className="btn-pill">
            {offering.cta.label}
          </a>
        </div>
      )}
    </article>
  );
}

function OfferingCard({ offering }: { offering: Offering }) {
  return (
    <article className="card p-6 md:p-8 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          {offering.availability && (
            <span className="inline-block text-[9px] uppercase tracking-[0.2em] text-sea-foam border border-sea-foam/30 rounded-full px-2.5 py-1 mb-3">
              {offering.availability}
            </span>
          )}
          <h3 className="font-serif text-2xl md:text-3xl text-milk leading-tight">{offering.name}</h3>
        </div>
        <PriceTag offering={offering} />
      </div>
      <p className="text-sm md:text-[15px] text-grey-400 leading-relaxed mb-5">{offering.tagline}</p>
      <ul className="space-y-2.5 mb-2">
        {offering.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-grey-300 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-sage mt-2 flex-shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {offering.cta && (
        <a
          href={offering.cta.href}
          className="btn-ghost text-xs mt-auto self-start"
        >
          {offering.cta.label}
        </a>
      )}
    </article>
  );
}
