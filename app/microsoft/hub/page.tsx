'use client';

import { DemoHubLayout, MicrosoftSquares } from '@/components/DemoHubLayout';

export default function MicrosoftHub() {
  return (
    <DemoHubLayout
      variant={{
        audience: 'microsoft',
        navLabel: 'Partner Hub',
        partner: true,
        searchPlaceholder: 'Search partner demos…',
        eyebrow: (
          <>
            <MicrosoftSquares className="w-3 h-3" />
            Microsoft Partner Hub
          </>
        ),
        heading: (
          <>
            Co-sell ready solutions for{' '}
            <em className="text-[#B2EEDA] not-italic">Microsoft</em> teams.
          </>
        ),
        description:
          'Curated Echelix demonstrations engineered for the Microsoft ecosystem — Azure-native, Teams-integrated, and ready to take to your customers.',
      }}
    />
  );
}
