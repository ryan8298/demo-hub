import { AdminNav } from '@/components/admin/AdminNav';
import { SubmissionCard } from '@/components/admin/SubmissionCard';
import { listSubmissions } from '@/lib/submissions';

// Always fresh — admin needs to see new submissions immediately. The proxy
// gates access; this page also only renders service-role data.
export const dynamic = 'force-dynamic';

export default async function AdminSubmissions() {
  const submissions = await listSubmissions();

  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status === 'new').length,
    reviewing: submissions.filter((s) => s.status === 'reviewing').length,
    accepted: submissions.filter((s) => s.status === 'accepted').length,
  };

  return (
    <div className="min-h-screen text-milk">
      <AdminNav current="submissions" />

      <header className="bg-wave relative pt-44 pb-12 border-b hairline">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-4">
            Admin Console
          </p>
          <h1 className="editorial font-serif text-[clamp(2rem,5vw,4rem)] text-milk leading-[1.05]">
            Use-case <em className="text-sea-foam not-italic">submissions</em>.
          </h1>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-milk/10 border hairline rounded-lg overflow-hidden">
            <Stat label="Total" value={stats.total} />
            <Stat label="New" value={stats.new} />
            <Stat label="Reviewing" value={stats.reviewing} />
            <Stat label="Accepted" value={stats.accepted} />
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 md:px-8 py-12 md:py-16">
        {submissions.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-milk/10 rounded-2xl">
            <div className="text-4xl mb-4 opacity-50">◯</div>
            <p className="text-sm uppercase tracking-[0.2em] text-grey-500">
              No submissions yet
            </p>
            <p className="text-xs text-grey-600 mt-3">
              Submissions from the public{' '}
              <a href="/pilot" className="text-sea-foam hover:underline">/pilot</a>{' '}
              form will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {submissions.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-1">{label}</p>
      <p className="font-serif text-3xl text-milk">{value}</p>
    </div>
  );
}
