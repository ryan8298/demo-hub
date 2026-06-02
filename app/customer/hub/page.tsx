import { DemoHubLayout } from '@/components/DemoHubLayout';
import { listDemosForAudience } from '@/lib/demos';
import { getViewer } from '@/lib/viewer';

// Dynamic (per-request): we read the visitor session to attribute one-pager
// downloads to the signed-in user without prompting them.
export const dynamic = 'force-dynamic';

export default async function CustomerHub() {
  const [demos, viewer] = await Promise.all([
    listDemosForAudience('customer'),
    getViewer(),
  ]);

  return (
    <DemoHubLayout
      initialDemos={demos}
      viewer={viewer}
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
