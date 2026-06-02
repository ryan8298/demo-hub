import { AdminNav } from '@/components/admin/AdminNav';
import { listPdfDownloads, summarizePopularity } from '@/lib/pdf-downloads';

export const dynamic = 'force-dynamic';

export default async function AdminDownloads() {
  const rows = await listPdfDownloads();
  const popularity = summarizePopularity(rows);
  const uniqueLeads = new Set(rows.map((r) => r.email.toLowerCase())).size;

  return (
    <div className="min-h-screen text-milk">
      <AdminNav current="downloads" />

      <header className="bg-wave relative pt-44 pb-12 border-b hairline">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-4">Admin Console</p>
          <h1 className="editorial font-serif text-[clamp(2rem,5vw,4rem)] text-milk leading-[1.05]">
            PDF <em className="text-sea-foam not-italic">downloads</em>.
          </h1>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px bg-milk/10 border hairline rounded-lg overflow-hidden">
            <Stat label="Total downloads" value={rows.length} />
            <Stat label="Unique leads" value={uniqueLeads} />
            <Stat label="Assets downloaded" value={popularity.length} />
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-8 py-12 md:py-16 space-y-14">
        {rows.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-milk/10 rounded-2xl">
            <div className="text-4xl mb-4 opacity-50">◯</div>
            <p className="text-sm uppercase tracking-[0.2em] text-grey-500">No downloads yet</p>
            <p className="text-xs text-grey-600 mt-3">
              Captured when visitors download a one-pager from the Offerings page or hubs.
            </p>
          </div>
        ) : (
          <>
            {/* Most popular */}
            <section>
              <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
                Most popular
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularity.map((p) => (
                  <div key={p.pdf_key} className="card p-5">
                    <h3 className="font-serif text-lg text-milk leading-tight mb-3">
                      {p.pdf_label}
                    </h3>
                    <div className="flex items-end gap-6">
                      <div>
                        <p className="font-serif text-3xl text-milk leading-none">{p.downloads}</p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mt-1">
                          downloads
                        </p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl text-sea-foam leading-none">
                          {p.uniqueEmails}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mt-1">
                          unique
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Follow-up list */}
            <section>
              <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-4">
                Recent downloads · who to follow up with
              </p>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <Th>When</Th>
                      <Th>Email</Th>
                      <Th className="hidden md:table-cell">Name</Th>
                      <Th className="hidden md:table-cell">Company</Th>
                      <Th>Asset</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-t hairline align-top">
                        <td className="py-3 px-4 text-grey-400 whitespace-nowrap text-xs">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <a href={`mailto:${r.email}`} className="text-sea-foam hover:underline">
                            {r.email}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-grey-300 hidden md:table-cell">
                          {r.name || '—'}
                        </td>
                        <td className="py-3 px-4 text-grey-300 hidden md:table-cell">
                          {r.company_name || '—'}
                        </td>
                        <td className="py-3 px-4 text-grey-200">{r.pdf_label || r.pdf_key}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
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

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`py-3 px-4 text-[10px] uppercase tracking-[0.2em] text-grey-500 font-medium ${className}`}>
      {children}
    </th>
  );
}
