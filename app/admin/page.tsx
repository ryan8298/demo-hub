import { listAllDemos } from '@/lib/admin-demos';
import { AdminNav } from '@/components/admin/AdminNav';
import { DemoRow } from '@/components/admin/DemoRow';

// Always re-fetch on each visit — admin needs to see fresh state, especially
// right after editing or deleting a demo. Middleware already gates access.
export const dynamic = 'force-dynamic';

export default async function AdminIndex() {
  const demos = await listAllDemos();

  const stats = {
    total: demos.length,
    featured: demos.filter((d) => d.featured).length,
    customer: demos.filter((d) => d.audience.includes('customer')).length,
    microsoft: demos.filter((d) => d.audience.includes('microsoft')).length,
  };

  return (
    <div className="min-h-screen bg-black text-milk">
      <AdminNav current="index" />

      {/* Header */}
      <header className="bg-wave relative pt-32 pb-12 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sage mb-4">
                Admin Console
              </p>
              <h1 className="editorial font-serif text-[clamp(2rem,5vw,4rem)] text-milk leading-[1.05]">
                All <em className="text-sea-foam not-italic">demos</em>.
              </h1>
            </div>
            <a href="/admin/demo/add" className="btn-pill self-start md:self-auto">
              + Publish new demo
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-milk/10 border hairline rounded-lg overflow-hidden">
            <Stat label="Total" value={stats.total} />
            <Stat label="Featured" value={stats.featured} />
            <Stat label="Customer" value={stats.customer} />
            <Stat label="Microsoft" value={stats.microsoft} />
          </div>
        </div>
      </header>

      {/* Table */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16">
        {demos.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-milk/10 rounded-2xl">
            <div className="text-4xl mb-4 opacity-50">◯</div>
            <p className="text-sm uppercase tracking-[0.2em] text-grey-500 mb-6">
              No demos published yet
            </p>
            <a href="/admin/demo/add" className="btn-pill">
              Publish your first demo →
            </a>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-4 pl-4 md:pl-6 pr-2 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium w-16 md:w-20">
                    {/* thumbnail column */}
                  </th>
                  <th className="py-4 px-2 md:px-4 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium">
                    Demo
                  </th>
                  <th className="py-4 px-2 md:px-4 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium hidden md:table-cell">
                    Industry
                  </th>
                  <th className="py-4 px-2 md:px-4 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium hidden lg:table-cell">
                    Audiences
                  </th>
                  <th className="py-4 px-2 md:px-4 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium hidden xl:table-cell">
                    Engagement
                  </th>
                  <th className="py-4 pl-2 pr-4 md:pr-6 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {demos.map((demo) => (
                  <DemoRow key={demo.id} demo={demo} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-1">
        {label}
      </p>
      <p className="font-serif text-3xl text-milk">{value}</p>
    </div>
  );
}
