import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getDemoBySlug, listRelatedDemos } from '@/lib/demos';
import { PublicNav, HubFooter, MicrosoftSquares } from '@/components/HubShared';
import { PublicDemoView } from '@/components/PublicDemoView';
import { verifySession, COOKIE_VISITOR } from '@/lib/session';
import { isMicrosoftEmail } from '@/lib/microsoft-access';

// Read the visitor cookie to decide which hub to send the user "back" to
// when they came in via in-app navigation. Anonymous visitors get a public
// nav with a Sign-in CTA instead.
async function resolveBackHref(): Promise<string | undefined> {
  const store = await cookies();
  const token = store.get(COOKIE_VISITOR)?.value;
  const session = await verifySession(token);
  if (!session || session.role !== 'visitor') return undefined;
  return isMicrosoftEmail(String(session.sub || ''))
    ? '/microsoft/hub'
    : '/customer/hub';
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
        <PublicDemoView demo={demo} />

        {/* Who it's for / What it solves */}
        {(demo.target_audience_description || demo.problem_statement) && (
          <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {demo.target_audience_description && (
              <div className="card p-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-3">
                  Who it&apos;s for
                </p>
                <h2 className="font-serif text-2xl text-milk mb-4">
                  Built for these teams
                </h2>
                <p className="text-sm text-grey-300 leading-relaxed whitespace-pre-wrap">
                  {demo.target_audience_description}
                </p>
              </div>
            )}

            {demo.problem_statement && (
              <div className="card p-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-3">
                  What it solves
                </p>
                <h2 className="font-serif text-2xl text-milk mb-4">
                  The problem we tackle
                </h2>
                <p className="text-sm text-grey-300 leading-relaxed whitespace-pre-wrap">
                  {demo.problem_statement}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Architecture diagram — image or PDF */}
        {demo.architecture_diagram_url && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-sage">
                Solution Architecture
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
            <h2 className="font-serif text-2xl md:text-3xl text-milk mb-6">
              How it fits together
            </h2>
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

        {/* ROI + timeline (unchanged) */}
        {(demo.roi_summary ||
          (demo.deployment_timeline && demo.deployment_timeline.length > 0)) && (
          <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {demo.roi_summary && (
              <div className="card p-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-3">
                  ROI Summary
                </p>
                <h2 className="font-serif text-2xl text-milk mb-4">
                  Why it matters
                </h2>
                <p className="text-sm text-grey-300 leading-relaxed">
                  {demo.roi_summary}
                </p>
              </div>
            )}

            {demo.deployment_timeline && demo.deployment_timeline.length > 0 && (
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
            )}
          </section>
        )}

        {/* Related */}
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
