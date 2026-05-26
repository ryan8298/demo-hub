import { notFound } from 'next/navigation';
import { getDemoById } from '@/lib/admin-demos';
import { AdminNav } from '@/components/admin/AdminNav';
import { DemoEditForm } from '@/components/admin/DemoEditForm';

export const dynamic = 'force-dynamic';

export default async function EditDemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const demo = await getDemoById(id);
  if (!demo) notFound();

  return (
    <div className="min-h-screen bg-black text-milk">
      <AdminNav current="edit" />

      <header className="bg-wave relative pt-32 pb-12 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <a
              href="/admin"
              className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition"
            >
              ← All demos
            </a>
            <span className="text-grey-700">/</span>
            <p className="text-xs uppercase tracking-[0.25em] text-sage">Edit</p>
          </div>
          <h1 className="editorial font-serif text-[clamp(2rem,5vw,4rem)] text-milk leading-[1.05] mb-3 max-w-3xl">
            {demo.title}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-grey-500 font-mono">
            /{demo.slug}
          </p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <DemoEditForm demo={demo} />
      </main>
    </div>
  );
}
