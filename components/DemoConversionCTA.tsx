'use client';

import { BookCallButton } from '@/components/BookCall';

/**
 * Compact conversion bar shown directly under the demo preview on
 * /demo/[slug] — prompts the visitor to act while interest is highest,
 * without the weight of a full hero block.
 */
export function DemoConversionCTA({ demoTitle }: { demoTitle: string }) {
  return (
    <section className="mt-6">
      <div className="card p-5 md:p-6 border-l-2 border-sea-foam/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-1">
            Take the next step
          </p>
          <p className="text-sm md:text-base text-grey-200 leading-snug">
            Want {demoTitle} tailored to your operation? Book a call or submit
            your own use case for a free prototype.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <BookCallButton />
          <a href="/pilot" className="btn-ghost text-xs">
            Submit a use case →
          </a>
        </div>
      </div>
    </section>
  );
}
