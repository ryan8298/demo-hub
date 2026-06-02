import { DemoHubLayout, MicrosoftSquares } from '@/components/DemoHubLayout';
import { listDemosForAudience } from '@/lib/demos';
import { getViewer } from '@/lib/viewer';

// Dynamic (per-request): we read the visitor session to attribute one-pager
// downloads to the signed-in user without prompting them.
export const dynamic = 'force-dynamic';

export default async function MicrosoftHub() {
  const [demos, viewer] = await Promise.all([
    listDemosForAudience('microsoft'),
    getViewer(),
  ]);

  return (
    <DemoHubLayout
      initialDemos={demos}
      viewer={viewer}
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
