import { notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getDemoBySlug, listRelatedDemos } from '@/lib/demos';
import { PublicNav, HubFooter, MicrosoftSquares } from '@/components/HubShared';
import { PublicDemoView } from '@/components/PublicDemoView';
import { verifySession, COOKIE_VISITOR, COOKIE_ADMIN } from '@/lib/session';
import { isMicrosoftEmail } from '@/lib/microsoft-access';
import {
  MetricStrip,
  CapabilityGrid,
  ChallengeInsights,
  ArchitectureFlow,
  AgentTimeline,
  BusinessOutcomeCards,
  OperationalTelemetry,
  TechStackChips,
  AcrBreakdownPanel,
} from '@/components/demo-sections';

// Resolve which hub to send the user "back" to. Checks both auth modes:
//   - Visitor cookie  → /customer/hub or /microsoft/hub based on email
//   - Admin cookie    → infer from Referer (admin can preview both hubs);
//                       fall back to /customer/hub
//   - Neither         → undefined (PublicNav shows a "Sign in" CTA)
//
// The admin branch is the bug fix: previously this only checked the visitor
// cookie, so admins viewing /demo/[slug] saw "Sign in" in the nav and got
// bounced to the landing page on click — even though their session was
// still valid.
async function resolveBackHref(): Promise<string | undefined> {
  const store = await cookies();

  // 1. Visitor session takes precedence — it carries the email we route on.
  const visitorToken = store.get(COOKIE_VISITOR)?.value;
  const visitorSession = await verifySession(visitorToken);
  if (visitorSession && visitorSession.role === 'visitor') {
    return isMicrosoftEmail(String(visitorSession.sub || ''))
      ? '/microsoft/hub'
      : '/customer/hub';
  }

  // 2. Admin session — admin can preview either hub, so infer from Referer.
  //    If the admin landed here via /microsoft/hub, send them back there.
  //    Otherwise default to /customer/hub.
  const adminToken = store.get(COOKIE_ADMIN)?.value;
  const adminSession = await verifySession(adminToken);
  if (adminSession && adminSession.role === 'admin') {
    const h = await headers();
    const referer = h.get('referer') || '';
    if (/\/microsoft\/hub(\?|$|\/)/.test(referer)) return '/microsoft/hub';
    return '/customer/hub';
  }

  // 3. Anonymous visitor — show the "Sign in" CTA via undefined backHref.
  return undefined;
}

// Cache at the edge — same revalidation cadence as the hub pages.
export const revalidate = 60;

/* Per-demo metadata for share previews */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = await getDemoBySlug(slug);
  if (!demo) return { title: 'Demo not found' };
  return {
    title: demo.title,
    description: demo.description || 'Echelix solution demo.',
    openGraph: {
      title: demo.title,
      description: demo.description || 'Echelix solution demo.',
      images: demo.preview_image_url ? [demo.preview_image_url] : undefined,
    },
  };
}

export default async function PublicDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = await getDemoBySlug(slug);
  if (!demo) notFound();

  const [related, backHref] = await Promise.all([
    listRelatedDemos(demo, 3),
    resolveBackHref(),
  ]);
  const isPartner = demo.audience.includes('microsoft');

  return (
    <div className="min-h-screen text-milk">
      <PublicNav backHref={backHref} />

      <header className="pt-44 pb-10 border-b hairline">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <a
              href="/"
              className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition"
            >
              Demos
            </a>
            <span className="text-grey-700">/</span>
            {demo.industry && (
              <span className="badge badge-sage">{demo.industry}</span>
            )}
            {isPartner && (
              <span className="badge">
                <MicrosoftSquares className="w-2.5 h-2.5" />
                Microsoft Co-Sell
              </span>
            )}
            {demo.featured && (
              <span className="badge">★ Featured</span>
            )}
          </div>
          <h1 className="editorial font-serif text-[clamp(2.25rem,5.5vw,5rem)] text-milk leading-[1.05] mb-6 max-w-4xl">
            {demo.title}
          </h1>
          {demo.description && (
            <p className="text-base md:text-lg text-grey-300 max-w-3xl leading-relaxed">
              {demo.description}
            </p>
          )}

          {demo.tags && demo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {demo.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5 rounded-full border border-milk/10 text-grey-400"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* 2. KPI Strip — floating headline numbers */}
        <MetricStrip metrics={demo.kpi_metrics ?? []} />

        {/* 2a. ACR sizing rationale — sits right under the KPI strip so the
             ACR pill (leftmost on partner tiles) and its explanation read
             together. Hidden when empty. */}
        <AcrBreakdownPanel breakdown={demo.acr_breakdown} />

        {/* 2b. Who it's for — context block right under the KPI numbers so
             visitors can immediately self-qualify before engaging with the
             preview. Optional — only renders if set. */}
        {demo.target_audience_description && (
          <section className="mt-8 card p-6 md:p-8 border-l-2 border-sea-foam/40">
            <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-3">
              Who it&apos;s for
            </p>
            <p className="text-sm md:text-base text-grey-200 leading-relaxed whitespace-pre-wrap">
              {demo.target_audience_description}
            </p>
          </section>
        )}

        {/* 3. Demo Preview — iframe or image (respects prefer_live_preview) */}
        <div className="mt-12">
          <PublicDemoView demo={demo} />
        </div>

        {/* 4. AI Capabilities */}
        <CapabilityGrid items={demo.ai_capabilities ?? []} />

        {/* 5. Operational Challenge — structured points + fallback to legacy problem_statement */}
        <ChallengeInsights
          points={demo.challenge_points ?? []}
          problemStatement={demo.problem_statement}
        />

        {/* 6. Architecture Flow — structured steps first, then the diagram image/PDF */}
        <ArchitectureFlow steps={demo.architecture_flow ?? []} />

        {demo.architecture_diagram_url && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-sage">
                Solution Architecture · Diagram
              </p>
              <a
                href={demo.architecture_diagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition"
              >
                Open ↗
              </a>
            </div>
            <div className="card p-4 md:p-6">
              {/\.pdf(\?|$)/i.test(demo.architecture_diagram_url) ? (
                <iframe
                  src={demo.architecture_diagram_url}
                  title={`${demo.title} architecture diagram`}
                  className="w-full h-[600px] rounded-lg bg-black/40 border-0"
                />
              ) : (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-black/40">
                  <Image
                    src={demo.architecture_diagram_url}
                    alt={`${demo.title} architecture diagram`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="object-contain"
                    unoptimized={demo.architecture_diagram_url.startsWith('http')}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. Agent Timeline */}
        <AgentTimeline events={demo.agent_timeline ?? []} />

        {/* 8. Business Outcomes — structured first, legacy roi_summary as fallback panel */}
        <BusinessOutcomeCards
          outcomes={demo.business_outcomes ?? []}
          roiSummary={demo.roi_summary}
        />

        {/* Legacy deployment_timeline — only render if no structured fields above filled in */}
        {demo.deployment_timeline &&
          demo.deployment_timeline.length > 0 &&
          (!demo.agent_timeline || demo.agent_timeline.length === 0) && (
            <section className="mt-12">
              <div className="card p-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-3">
                  Implementation
                </p>
                <h2 className="font-serif text-2xl text-milk mb-4">
                  How it rolls out
                </h2>
                <div className="space-y-4">
                  {demo.deployment_timeline.map((phase, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-sea-foam mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-milk">{phase.phase}</span>
                        <span className="text-grey-400"> — {phase.duration}</span>
                        {phase.details && (
                          <p className="text-xs text-grey-500 mt-1 leading-relaxed">
                            {phase.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        {/* Tech stack chips */}
        <TechStackChips stack={demo.tech_stack ?? []} />

        {/* Operational telemetry — small live stats footer */}
        <OperationalTelemetry stats={demo.operational_stats ?? []} />

        {/* (Who it's for moved to the top — under the KPI strip) */}

        {/* 9. Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-6">
              Related demos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <a
                  key={r.id}
                  href={`/demo/${r.slug}`}
                  className="card card-lift overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-40 bg-gradient-to-br from-sage via-sage-dark to-black">
                    {r.preview_image_url && (
                      <Image
                        src={r.preview_image_url}
                        alt={r.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized={r.preview_image_url.startsWith('http')}
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-sage mb-2">
                      {r.industry || 'General'}
                    </p>
                    <h3 className="font-serif text-lg text-milk leading-tight">
                      {r.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <HubFooter />
    </div>
  );
}
