'use client';

import { BookCallButton } from '@/components/BookCall';

/**
 * Conversion band shown at the bottom of every /demo/[slug] one-pager.
 * Gives a signed-in visitor an action to take after reading the demo:
 * book a discovery call, or pitch their own use case for the pilot.
 */
export function DemoConversionCTA({ demoTitle }: { demoTitle: string }) {
  return (
    <section className="mt-20">
      <div className="card p-8 md:p-12 border-l-2 border-sea-foam/40 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-4">
          Take the next step
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-milk leading-tight mb-4 max-w-2xl mx-auto">
          Want this tailored to your operation?
        </h2>
        <p className="text-sm md:text-base text-grey-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Book a discovery call to see how {demoTitle} maps to your environment —
          or submit your own use case for a chance at a free, custom prototype
          built in under a week.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <BookCallButton />
          <a href="/pilot" className="btn-ghost">
            Submit a use case →
          </a>
        </div>
      </div>
    </section>
  );
}
