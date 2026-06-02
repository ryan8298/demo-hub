import { ONE_PAGERS, ONE_PAGER_SUMMARY } from '@/lib/one-pagers';

/**
 * "Industry one-pagers" — a grid of downloadable Embedded Agent Pilot PDFs,
 * one per industry. Server-safe (plain links). Reused on the Offerings page
 * and inside the customer / Microsoft hubs.
 *
 * Each link opens the full PDF inline in a new browser tab.
 */
export function OnePagersSection({
  heading = 'Industry one-pagers',
  intro = 'The Embedded Agent Pilot, tailored by industry. Download the full one-pager.',
  className = '',
}: {
  heading?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-2">
            {heading}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-milk leading-tight max-w-2xl">
            {intro}
          </h2>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-grey-500 shrink-0">
          {ONE_PAGER_SUMMARY}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ONE_PAGERS.map((op) => (
          <article key={op.slug} className="card p-6 flex flex-col">
            <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-2">
              Embedded Agent Pilot
            </p>
            <h3 className="font-serif text-xl text-milk leading-tight mb-2">
              {op.industry}
            </h3>
            <p className="text-sm text-grey-400 leading-relaxed mb-4">{op.blurb}</p>

            <ul className="flex flex-wrap gap-2 mb-6">
              {op.useCases.map((u) => (
                <li
                  key={u}
                  className="text-[10px] uppercase tracking-[0.1em] text-grey-300 px-2.5 py-1 rounded-full border border-milk/10"
                >
                  {u}
                </li>
              ))}
            </ul>

            <a
              href={op.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill text-xs mt-auto self-start"
            >
              View one-pager (PDF) →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
