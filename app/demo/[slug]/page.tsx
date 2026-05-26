import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getDemoBySlug, listRelatedDemos } from '@/lib/demos';
import { PublicNav, HubFooter, MicrosoftSquares } from '@/components/HubShared';
import { PublicDemoView } from '@/components/PublicDemoView';

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

  const related = await listRelatedDemos(demo, 3);
  const isPartner = demo.audience.includes('microsoft');

  return (
    <div className="min-h-screen bg-black text-milk">
      <PublicNav />

      <header className="pt-32 pb-10 border-b hairline">
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

        {/* Body — ROI + timeline */}
        {(demo.roi_summary ||
          (demo.deployment_timeline && demo.deployment_timeline.length > 0)) && (
          <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Sign-in CTA */}
        <section className="mt-16 card p-10 md:p-14 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-4">
            Explore the full hub
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-milk mb-4 leading-tight">
            See <em className="text-sea-foam not-italic">every</em> Echelix solution.
          </h2>
          <p className="text-sm md:text-base text-grey-400 max-w-xl mx-auto mb-8">
            Get instant access to the full catalog of interactive demonstrations.
            Free, no credit card — just your work email.
          </p>
          <a href="/" className="btn-pill">
            Access the Demo Hub →
          </a>
        </section>

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
