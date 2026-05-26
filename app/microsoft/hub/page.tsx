import { DemoHubLayout, MicrosoftSquares } from '@/components/DemoHubLayout';
import { listDemosForAudience } from '@/lib/demos';

// Server Component — fetches demos at request time and ships them in the
// initial HTML. Cached for 60s at the route level (revalidate below).
export const revalidate = 60;

export default async function MicrosoftHub() {
  const demos = await listDemosForAudience('microsoft');

  return (
    <DemoHubLayout
      initialDemos={demos}
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
            <em className="text-sea-foam not-italic">Microsoft</em> teams.
          </>
        ),
        description:
          'Curated Echelix demonstrations engineered for the Microsoft ecosystem — Azure-native, Teams-integrated, and ready to take to your customers.',
      }}
    />
  );
}
