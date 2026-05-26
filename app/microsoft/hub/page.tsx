'use client';

import { useEffect, useMemo, useState } from 'react';
import { HubNav, HubFooter, DemoCard } from '@/components/HubShared';
import { Demo } from '@/lib/types';

export default function MicrosoftHub() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');

  useEffect(() => {
    fetch('/api/demos?audience=microsoft')
      .then((res) => res.json())
      .then((data) => {
        setDemos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const industries = useMemo(() => {
    const set = new Set<string>();
    demos.forEach((d) => d.industry && set.add(d.industry));
    return ['All', ...Array.from(set).sort()];
  }, [demos]);

  const filtered = useMemo(() => {
    return demos.filter((d) => {
      const matchesSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesIndustry =
        industryFilter === 'All' || d.industry === industryFilter;
      return matchesSearch && matchesIndustry;
    });
  }, [demos, search, industryFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="spinner mx-auto" />
          <p className="mt-4 text-[#8B8586] text-xs uppercase tracking-[0.25em]">Loading partner solutions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#F3F3E9]">
      <HubNav label="Partner Hub" partner />

      {/* Hero */}
      <header className="bg-wave relative pt-32 pb-20 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7FAC9D] mb-6 flex items-center gap-2">
            <svg viewBox="0 0 23 23" className="w-3 h-3">
              <rect width="10" height="10" fill="#f25022" />
              <rect x="11" width="10" height="10" fill="#7fba00" />
              <rect y="11" width="10" height="10" fill="#00a4ef" />
              <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
            </svg>
            Microsoft Partner Hub
          </p>
          <h1 className="editorial font-serif text-[clamp(2.5rem,6vw,5.5rem)] text-[#F3F3E9] leading-[1.04] mb-6 max-w-4xl">
            Co-sell ready solutions for <em className="text-[#B2EEDA] not-italic">Microsoft</em> teams.
          </h1>
          <p className="text-base md:text-lg text-[#B2AEAF] max-w-2xl leading-relaxed">
            Curated Echelix demonstrations engineered for the Microsoft ecosystem — Azure-native, Teams-integrated, and ready to take to your customers.
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="border-b hairline sticky top-[68px] z-40 bg-black/85 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search partner demos…"
              className="input-field pl-10"
            />
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z" />
            </svg>
          </div>
          <div className="flex gap-2 flex-wrap">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                className={`text-[10px] uppercase tracking-[0.15em] font-medium px-4 py-2 rounded-full transition border ${
                  industryFilter === ind
                    ? 'bg-[#B2EEDA] text-black border-[#B2EEDA]'
                    : 'bg-transparent text-[#B2AEAF] border-[#F3F3E9]/15 hover:border-[#B2EEDA] hover:text-[#B2EEDA]'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-[1400px] mx-auto px-8 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#F3F3E9]/10 rounded-2xl">
            <div className="text-4xl mb-4 opacity-50">◯</div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#706A6B]">No partner demos match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((demo) => (
              <DemoCard
                key={demo.id}
                demo={demo}
                expanded={expandedId === demo.id}
                partner
                onToggle={() =>
                  setExpandedId(expandedId === demo.id ? null : demo.id)
                }
              />
            ))}
          </div>
        )}
      </main>

      <HubFooter />
    </div>
  );
}
