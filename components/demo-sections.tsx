/**
 * Demo detail page sections.
 *
 * Each component renders one structured storytelling block on
 * /demo/[slug]. They share visual DNA: dark glass cards, sea-foam
 * accent treatments, monospace numbers, uppercase eyebrows with
 * tracking, subtle pulse animations, and the existing Echelix
 * atmosphere bleeding through transparent backgrounds.
 *
 * Design references in spirit: Palantir, Microsoft Fabric,
 * OpenAI Enterprise, Vercel Enterprise. Density + scanability.
 *
 * All are server-renderable — no client-side state.
 */

import type {
  KpiMetric,
  BusinessOutcome,
  AiCapability,
  AgentEvent,
  AgentEventStatus,
  ArchitectureStep,
  OperationalStat,
} from '@/lib/types';

/* ============================================================
   Shared section header — eyebrow + title pattern used across
   every block for consistent vertical rhythm.
   ============================================================ */
function SectionHeader({
  eyebrow,
  title,
  count,
  accent = 'sea-foam',
}: {
  eyebrow: string;
  title: React.ReactNode;
  count?: number;
  accent?: 'sea-foam' | 'sage' | 'error';
}) {
  const accentClass =
    accent === 'sage'
      ? 'text-sage'
      : accent === 'error'
        ? 'text-error'
        : 'text-sea-foam';
  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div>
        <p className={`text-[10px] uppercase tracking-[0.25em] ${accentClass} mb-2`}>
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-milk leading-tight">
          {title}
        </h2>
      </div>
      {typeof count === 'number' &&  count > 0 && (
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-grey-500 whitespace-nowrap">
          {String(count).padStart(2, '0')} items
        </span>
      )}
    </div>
  );
}

/* ============================================================
   1. MetricStrip — floating KPI pills
   Used immediately under the hero. Visual weight, easy scan.
   ============================================================ */
export function MetricStrip({ metrics }: { metrics: KpiMetric[] }) {
  if (!metrics?.length) return null;
  return (
    <section className="mt-10 mb-12">
      <div
        className={`grid gap-3 md:gap-4 grid-cols-2 ${
          metrics.length >= 4
            ? 'md:grid-cols-4'
            : `md:grid-cols-${Math.min(metrics.length, 3)}`
        }`}
      >
        {metrics.map((m, i) => (
          <div
            key={`${m.label}-${i}`}
            className="card p-5 md:p-6 text-center relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sea-foam/40 to-transparent" />
            <p className="font-serif text-3xl md:text-4xl text-sea-foam tabular-nums leading-none">
              {m.value}
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-grey-400 mt-3">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   2. CapabilityGrid — AI capability cards
   ============================================================ */
export function CapabilityGrid({ items }: { items: AiCapability[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-16">
      <SectionHeader
        eyebrow="AI Capabilities"
        title={<>What the agent <em className="text-sea-foam not-italic">actually does</em></>}
        count={items.length}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <div key={`${c.label}-${i}`} className="card p-6 group transition">
            <div className="w-10 h-10 rounded-lg bg-sea-foam/10 border border-sea-foam/25 flex items-center justify-center mb-4 group-hover:bg-sea-foam/15 transition">
              <span className="font-mono text-xs text-sea-foam">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-serif text-lg text-milk leading-tight mb-2">
              {c.label}
            </h3>
            {c.description && (
              <p className="text-sm text-grey-400 leading-relaxed">
                {c.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   3. ChallengeInsights — operational pain-point panels
   ============================================================ */
export function ChallengeInsights({
  points,
  problemStatement,
}: {
  points: string[];
  problemStatement?: string;
}) {
  const hasPoints = points?.length > 0;
  if (!hasPoints && !problemStatement) return null;
  return (
    <section className="mt-16">
      <SectionHeader
        eyebrow="Operational Challenge"
        title={<>The problem we <em className="text-sea-foam not-italic">tackle</em></>}
        count={hasPoints ? points.length : undefined}
        accent="error"
      />
      <div className={`grid gap-4 ${hasPoints && points.length > 2 ? 'md:grid-cols-2' : ''}`}>
        {problemStatement && (
          <div className={`card p-6 ${hasPoints ? 'md:col-span-2' : ''}`}>
            <p className="text-sm text-grey-300 leading-relaxed whitespace-pre-wrap">
              {problemStatement}
            </p>
          </div>
        )}
        {hasPoints &&
          points.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-lg bg-error/5 border-l-2 border-error/40 hover:border-error/70 transition"
            >
              <span className="font-mono text-[10px] text-error/80 mt-1 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm text-grey-200 leading-relaxed">{point}</p>
            </div>
          ))}
      </div>
    </section>
  );
}

/* ============================================================
   4. ArchitectureFlow — connected system steps
   Horizontal flow on md+, vertical stack on mobile, with
   chevron separators between cards.
   ============================================================ */
export function ArchitectureFlow({ steps }: { steps: ArchitectureStep[] }) {
  if (!steps?.length) return null;
  return (
    <section className="mt-16">
      <SectionHeader
        eyebrow="Architecture Flow"
        title={<>How it <em className="text-sea-foam not-italic">flows</em></>}
        count={steps.length}
        accent="sage"
      />
      <div className="relative">
        <div className="grid gap-3 md:gap-0 md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:items-stretch">
          {steps.map((s, i) => (
            <div key={`${s.step}-${i}`} className="relative flex md:flex-col">
              <div className="card p-5 flex-1 relative md:rounded-none md:first:rounded-l-2xl md:last:rounded-r-2xl">
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-sage mb-2">
                  Step {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-base md:text-lg text-milk leading-snug">
                  {s.step}
                </h3>
                {s.description && (
                  <p className="text-xs text-grey-400 mt-2 leading-relaxed">
                    {s.description}
                  </p>
                )}
                {/* Animated pulse on the leading edge of each card */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-6 bg-sea-foam/60 hidden md:block" />
              </div>
              {i < steps.length - 1 && (
                <div className="flex md:hidden items-center justify-center py-2 text-sea-foam/60">
                  ↓
                </div>
              )}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute right-[-9px] top-1/2 -translate-y-1/2 z-10 w-[18px] h-[18px] rounded-full bg-black border border-sea-foam/40 items-center justify-center text-[10px] text-sea-foam">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   5. AgentTimeline — operational event feed with status pills
   ============================================================ */
const STATUS_STYLES: Record<AgentEventStatus, { dot: string; label: string; text: string }> = {
  pending:     { dot: 'bg-grey-500',                label: 'Pending',     text: 'text-grey-400' },
  in_progress: { dot: 'bg-sea-foam animate-pulse',  label: 'In progress', text: 'text-sea-foam' },
  completed:   { dot: 'bg-sage',                    label: 'Completed',   text: 'text-sage' },
  alert:       { dot: 'bg-error animate-pulse',     label: 'Alert',       text: 'text-error' },
};

export function AgentTimeline({ events }: { events: AgentEvent[] }) {
  if (!events?.length) return null;
  return (
    <section className="mt-16">
      <SectionHeader
        eyebrow="Agent Activity"
        title={<>What the agent <em className="text-sea-foam not-italic">did</em></>}
        count={events.length}
      />
      <div className="card p-6 md:p-8 relative">
        {/* Vertical timeline rail */}
        <div className="absolute left-[34px] md:left-[42px] top-8 bottom-8 w-px bg-sea-foam/15" />
        <ul className="space-y-5">
          {events.map((ev, i) => {
            const s = STATUS_STYLES[ev.status ?? 'completed'];
            return (
              <li key={i} className="relative flex items-start gap-4 md:gap-5 pl-2">
                <span className={`relative z-10 w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${s.dot} ring-4 ring-[#0a0a0a]`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    {ev.timestamp && (
                      <span className="text-[10px] font-mono text-grey-500 tabular-nums">
                        {ev.timestamp}
                      </span>
                    )}
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-medium ${s.text}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-sm text-milk mt-1 leading-relaxed">
                    {ev.event}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   6. BusinessOutcomeCards — measurable result cards
   ============================================================ */
export function BusinessOutcomeCards({
  outcomes,
  roiSummary,
}: {
  outcomes: BusinessOutcome[];
  roiSummary?: string;
}) {
  const hasOutcomes = outcomes?.length > 0;
  if (!hasOutcomes && !roiSummary) return null;
  return (
    <section className="mt-16">
      <SectionHeader
        eyebrow="Business Outcomes"
        title={<>What it <em className="text-sea-foam not-italic">delivers</em></>}
        count={hasOutcomes ? outcomes.length : undefined}
      />
      {hasOutcomes && (
        <div
          className={`grid gap-4 ${
            outcomes.length >= 3
              ? 'md:grid-cols-3'
              : `md:grid-cols-${outcomes.length}`
          }`}
        >
          {outcomes.map((o, i) => (
            <div
              key={`${o.label}-${i}`}
              className="card p-6 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sea-foam/40 to-transparent" />
              {o.value && (
                <p className="font-serif text-4xl md:text-5xl text-sea-foam tabular-nums leading-none">
                  {o.value}
                </p>
              )}
              <h3 className="font-medium text-sm text-milk mt-4 uppercase tracking-[0.1em]">
                {o.label}
              </h3>
              {o.description && (
                <p className="text-xs text-grey-400 mt-2 leading-relaxed">
                  {o.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {roiSummary && (
        <div className={`card p-6 ${hasOutcomes ? 'mt-4' : ''}`}>
          <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-2">
            ROI Summary
          </p>
          <p className="text-sm text-grey-300 leading-relaxed whitespace-pre-wrap">
            {roiSummary}
          </p>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   7. OperationalTelemetry — small live-feeling stat indicators
   ============================================================ */
export function OperationalTelemetry({ stats }: { stats: OperationalStat[] }) {
  if (!stats?.length) return null;
  return (
    <section className="mt-12">
      <div className="card p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-sea-foam animate-pulse" />
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-grey-400">
            Live · Operational Telemetry
          </span>
        </div>
        <div
          className={`grid gap-3 grid-cols-2 ${
            stats.length >= 4
              ? 'sm:grid-cols-3 md:grid-cols-6'
              : `md:grid-cols-${stats.length}`
          }`}
        >
          {stats.map((s, i) => (
            <div
              key={`${s.label}-${i}`}
              className="bg-black/40 border border-sea-foam/10 rounded-lg p-3 text-center"
            >
              <p className="font-mono text-xl md:text-2xl text-sea-foam tabular-nums leading-none">
                {s.value}
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-grey-500 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Bonus: TechStack chips — small, used after Architecture Flow
   ============================================================ */
export function TechStackChips({ stack }: { stack: string[] }) {
  if (!stack?.length) return null;
  return (
    <section className="mt-10">
      <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-3">
        Built on
      </p>
      <div className="flex flex-wrap gap-2">
        {stack.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5 rounded-full border border-sea-foam/25 bg-sea-foam/5 text-sea-foam"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
