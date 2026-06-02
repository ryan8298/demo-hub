'use client';

import { useState } from 'react';
import { MarketingNav } from '@/components/MarketingNav';
import { SignInModal } from '@/components/SignInModal';
import { SiteFooter } from '@/components/SiteFooter';
import { BookCallButton } from '@/components/BookCall';

export default function Landing() {
  const [showSignIn, setShowSignIn] = useState(false);
  const openSignIn = () => setShowSignIn(true);

  return (
    <div className="min-h-screen text-milk relative">
      {/* Global background lives in app/layout.tsx — no per-page bg needed */}

      <MarketingNav onSignIn={openSignIn} />

      {/* Hero — content only. Background is provided by EchelixAtmosphere
          in the root layout. */}
      <section className="relative min-h-screen flex flex-col justify-center pt-40 pb-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10 w-full">
          <div className="text-center max-w-[1100px] mx-auto">
            <h1 className="font-serif text-[clamp(2.75rem,8vw,7rem)] text-white leading-[1.04] tracking-[-0.02em] mb-8">
              Experience the future of{' '}
              <em className="text-sea-foam not-italic">agentic</em> enterprise software.
            </h1>
            <p className="text-base md:text-lg text-grey-200 max-w-2xl mx-auto mb-4 leading-relaxed">
              Hands-on demonstrations of Echelix agentic solutions — built on
              Microsoft Azure, integrated with Microsoft 365, and engineered for
              the enterprise.
            </p>
            <p className="text-base md:text-lg text-grey-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Every tile opens to a one-pager covering the business problem
              it solves, the audience it serves, a solution architecture
              diagram, and ROI. Sign in with your work email to browse the
              full catalog.
            </p>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <button onClick={openSignIn} className="btn-pill">
                Access Demos →
              </button>
              <a href="/offerings" className="btn-ghost">
                View Offerings
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-16">
            <p className="md:col-span-3 text-xs uppercase tracking-[0.25em] text-sage">
              Why Echelix
            </p>
            <h2 className="md:col-span-9 font-serif text-3xl md:text-5xl text-milk leading-tight">
              Solutions engineered for the next era of enterprise — agentic, integrated, measurable.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-milk/10 border hairline">
            {[
              {
                num: '01',
                title: 'Interactive Demos',
                body: 'Live, hands-on demonstrations of every Echelix solution. No slides, no recordings — just real software in real time.',
              },
              {
                num: '02',
                title: 'Secure Access',
                body: 'Enterprise-grade security with seamless Microsoft Teams integration for partners and customers.',
              },
              {
                num: '03',
                title: 'Instant Onboarding',
                body: 'Start exploring in seconds — your email and company name are all we need to get you in.',
              },
            ].map((f) => (
              <div key={f.num} className="bg-black p-8 md:p-10 hover:bg-[#0a0a0a] transition">
                <div className="text-xs tracking-[0.25em] text-sage mb-6">{f.num}</div>
                <h3 className="font-serif text-2xl md:text-3xl text-milk mb-4">{f.title}</h3>
                <p className="text-sm text-grey-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — single band (the footer no longer duplicates this) */}
      <section className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-24 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-6">
            Ready When You Are
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-milk mb-8 max-w-3xl mx-auto leading-[1.05]">
            See what <em className="text-sea-foam not-italic">agentic</em> looks like in production.
          </h2>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button onClick={openSignIn} className="btn-pill">
              Access Demos →
            </button>
            <BookCallButton variant="ghost" />
            <a href="/pilot" className="btn-ghost">
              Submit a use case →
            </a>
          </div>
        </div>
      </section>

      {/* Footer — legal only on the landing page (CTAs live in the nav + above) */}
      <SiteFooter showCta={false} />

      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
}
