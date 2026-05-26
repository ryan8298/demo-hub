import { DemoHubLayout } from '@/components/DemoHubLayout';
import { listDemosForAudience } from '@/lib/demos';

// Server Component — fetches demos at request time and ships them in the
// initial HTML. Cached for 60s at the route level (revalidate below).
export const revalidate = 60;

export default async function CustomerHub() {
  const demos = await listDemosForAudience('customer');

  return (
    <DemoHubLayout
      initialDemos={demos}
      variant={{
        audience: 'customer',
        navLabel: 'Demo Hub',
        searchPlaceholder: 'Search demos…',
        eyebrow: (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            Customer Demo Hub
          </>
        ),
        heading: (
          <>
            Solutions built for{' '}
            <em className="text-sea-foam not-italic">your</em> business.
          </>
        ),
        description:
          'Explore live, interactive demonstrations of Echelix solutions. Click any tile for ROI summaries, implementation timelines, and the full demo.',
      }}
    />
  );
}
