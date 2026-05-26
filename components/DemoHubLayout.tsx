'use client';

import { useEffect, useMemo, useState } from 'react';
import { Demo } from '@/lib/types';
import {
  HubNav,
  HubFooter,
  DemoCard,
  DemoGridSkeleton,
  MicrosoftSquares,
} from '@/components/HubShared';

/**
 * Shared hub layout used by both /customer/hub and /microsoft/hub.
 *
 * Each hub just specifies its eyebrow, heading, supporting text, and
 * audience query — everything else (data fetch, search, filter, grid,
 * empty/loading states, featured row) is identical.
 */
export type HubVariant = {
  audience: 'customer' | 'microsoft';
  navLabel: string;
  eyebrow: React.ReactNode;
  heading: React.ReactNode;
  description: string;
  searchPlaceholder: string;
  partner?: boolean;
};

export function DemoHubLayout({ variant }: { variant: HubVariant }) {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(`/api/demos?audience=${variant.audience}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDemos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [variant.audience]);

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

  // Pull featured demos to the top — but only when no filters are active
  // (otherwise it's confusing why a "featured" demo isn't matching the search).
  const filtersActive = search.trim().length > 0 || industryFilter !== 'All';
  const featured = filtersActive ? [] : filtered.filter((d) => d.featured);
  const regular = filtersActive ? filtered : filtered.filter((d) => !d.featured);

  const clearFilters = () => {
    setSearch('');
    setIndustryFilter('All');
  };

  return (
    <div className="min-h-screen bg-black text-[#F3F3E9]">
      <HubNav label={variant.navLabel} partner={variant.partner} />

      {/* Hero */}
      <header className="bg-wave relative pt-32 pb-20 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7FAC9D] mb-6 flex items-center gap-2">
            {variant.eyebrow}
          </p>
          <h1 className="editorial font-serif text-[clamp(2.5rem,6vw,5.5rem)] text-[#F3F3E9] leading-[1.04] mb-6 max-w-4xl">
            {variant.heading}
          </h1>
          <p className="text-base md:text-lg text-[#B2AEAF] max-w-2xl leading-relaxed">
            {variant.description}
          </p>
        </div>
      </header>

      {/* Filters — not sticky on mobile to avoid overlapping the nav */}
      <section className="border-b hairline md:sticky md:top-[76px] z-40 bg-black/85 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-4 md:py-5 flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
          <div className="relative flex-1 md:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={variant.searchPlaceholder}
              className="input-field pl-10"
              aria-label="Search demos"
            />
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#706A6B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z"
              />
            </svg>
          </div>
          <div className="flex gap-2 flex-wrap overflow-x-auto -mx-1 px-1 pb-1 md:pb-0">
            {industries.map((ind) => {
              const count =
                ind === 'All' ? demos.length : demos.filter((d) => d.industry === ind).length;
              const active = industryFilter === ind;
              return (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`text-[10px] uppercase tracking-[0.15em] font-medium px-3 md:px-4 py-2 rounded-full transition border whitespace-nowrap ${
                    active
                      ? 'bg-[#B2EEDA] text-black border-[#B2EEDA]'
                      : 'bg-transparent text-[#B2AEAF] border-[#F3F3E9]/15 hover:border-[#B2EEDA] hover:text-[#B2EEDA]'
                  }`}
                >
                  {ind}
                  <span className={`ml-1.5 ${active ? 'opacity-60' : 'opacity-40'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16">
        {loading ? (
          <DemoGridSkeleton />
        ) : error ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            filtersActive={filtersActive}
            onClear={clearFilters}
          />
        ) : (
          <>
            {featured.length > 0 && (
              <section className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#7FAC9D] mb-4">
                  ★ Featured
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((demo) => (
                    <DemoCard
                      key={demo.id}
                      demo={demo}
                      expanded={expandedId === demo.id}
                      partner={variant.partner}
                      featured
                      onToggle={() =>
                        setExpandedId(expandedId === demo.id ? null : demo.id)
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {regular.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#706A6B] mb-4">
                    All demos
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((demo) => (
                    <DemoCard
                      key={demo.id}
                      demo={demo}
                      expanded={expandedId === demo.id}
                      partner={variant.partner}
                      onToggle={() =>
                        setExpandedId(expandedId === demo.id ? null : demo.id)
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <HubFooter />
    </div>
  );
}

function EmptyState({
  filtersActive,
  onClear,
}: {
  filtersActive: boolean;
  onClear: () => void;
}) {
  return (
    <div className="text-center py-20 md:py-24 border border-dashed border-[#F3F3E9]/10 rounded-2xl">
      <div className="text-4xl mb-4 opacity-50">◯</div>
      <p className="text-sm uppercase tracking-[0.2em] text-[#706A6B] mb-4">
        {filtersActive ? 'No demos match your filters' : 'No demos available yet'}
      </p>
      {filtersActive && (
        <button onClick={onClear} className="btn-ghost text-xs">
          Clear filters
        </button>
      )}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center py-20 md:py-24 border border-dashed border-[#CD3232]/30 rounded-2xl bg-[#CD3232]/5">
      <div className="text-4xl mb-4 text-[#CD3232]/80">⚠</div>
      <p className="text-sm uppercase tracking-[0.2em] text-[#CD3232] mb-4">
        Couldn&apos;t load demos
      </p>
      <button onClick={onRetry} className="btn-ghost text-xs">
        Try again
      </button>
    </div>
  );
}

/* Re-export for hub pages */
export { MicrosoftSquares };
