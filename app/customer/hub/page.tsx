'use client';

import { DemoHubLayout } from '@/components/DemoHubLayout';

export default function CustomerHub() {
  return (
    <DemoHubLayout
      variant={{
        audience: 'customer',
        navLabel: 'Demo Hub',
        searchPlaceholder: 'Search demos…',
        eyebrow: (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FAC9D] animate-pulse" />
            Customer Demo Hub
          </>
        ),
        heading: (
          <>
            Solutions built for{' '}
            <em className="text-[#B2EEDA] not-italic">your</em> business.
          </>
        ),
        description:
          'Explore live, interactive demonstrations of Echelix solutions. Click any tile for ROI summaries, implementation timelines, and the full demo.',
      }}
    />
  );
}
