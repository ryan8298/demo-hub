'use client';

import { useMemo, useState } from 'react';
import { Demo } from '@/lib/types';
import {
  HubNav,
  HubFooter,
  DemoCard,
  MicrosoftSquares,
} from '@/components/HubShared';
import { RecentlyViewedRow } from '@/components/RecentlyViewedRow';

/**
 * Shared hub layout used by both /customer/hub and /microsoft/hub.
 *
 * Demos are passed in as `initialDemos` — the hub pages are now async
 * Server Components that query Supabase at request time. This eliminates
 * the spinner flash and the client→API round-trip.
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

export function DemoHubLayout({
  variant,
  initialDemos,
}: {
  variant: HubVariant;
  initialDemos: Demo[];
}) {
  const [demos] = useState<Demo[]>(initialDemos);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const industries = useMemo(() => {
    const set = new Set<string>();
    demos.forEach((d) => d.industry && set.add(d.industry));
    return ['All', ...Array.from(set).sort()];
  }, [demos]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    demos.forEach((d) => (d.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [demos]);

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const filtered = useMemo(() => {
    return demos.filter((d) => {
      const matchesSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(search.toLowerCase());
      const matchesIndustry =
        industryFilter === 'All' || d.industry === industryFilter;
      // ALL selected tags must be present on the demo (AND semantics).
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((t) => (d.tags || []).includes(t));
      return matchesSearch && matchesIndustry && matchesTags;
    });
  }, [demos, search, industryFilter, activeTags]);

  // Pull featured demos to the top — but only when no filters are active
  // (otherwise it's confusing why a "featured" demo isn't matching the search).
  const filtersActive =
    search.trim().length > 0 || industryFilter !== 'All' || activeTags.length > 0;
  const featured = filtersActive ? [] : filtered.filter((d) => d.featured);
  const regular = filtersActive ? filtered : filtered.filter((d) => !d.featured);

  const clearFilters = () => {
    setSearch('');
    setIndustryFilter('All');
    setActiveTags([]);
  };

  return (
    <div className="min-h-screen text-milk">
      <HubNav label={variant.navLabel} partner={variant.partner} />

      {/* Hero */}
      <header className="bg-wave relative pt-44 pb-20 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-6 flex items-center gap-2">
            {variant.eyebrow}
          </p>
          <h1 className="editorial font-serif text-[clamp(2.5rem,6vw,5.5rem)] text-milk leading-[1.04] mb-6 max-w-4xl">
            {variant.heading}
          </h1>
          <p className="text-base md:text-lg text-grey-300 max-w-2xl leading-relaxed">
            {variant.description}
          </p>
        </div>
      </header>

      {/* Filters — not sticky on mobile to avoid overlapping the nav */}
      <section className="border-b hairline md:sticky md:top-[140px] z-40 bg-black/85 backdrop-blur">
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
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-500"
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
                      ? 'bg-sea-foam text-black border-sea-foam'
                      : 'bg-transparent text-grey-300 border-milk/15 hover:border-sea-foam hover:text-sea-foam'
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
        {/* Tag row — secondary filter dimension, AND'd with industry */}
        {allTags.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 pb-4 md:pb-5 flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500 whitespace-nowrap hidden md:block">
              Tags
            </span>
            <div className="flex gap-2 flex-wrap overflow-x-auto -mx-1 px-1">
              {allTags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5 rounded-full transition border whitespace-nowrap ${
                      active
                        ? 'bg-sage text-black border-sage'
                        : 'bg-transparent text-grey-400 border-milk/10 hover:border-sage hover:text-sage'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Grid */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16">
        {filtered.length === 0 ? (
          <EmptyState
            filtersActive={filtersActive}
            onClear={clearFilters}
          />
        ) : (
          <>
            {/* Continue exploring — only renders when localStorage has entries */}
            {!filtersActive && <RecentlyViewedRow demos={demos} />}

            {featured.length > 0 && (
              <section className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-4">
                  ★ Featured
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((demo) => (
                    <DemoCard
                      key={demo.id}
                      demo={demo}
                      partner={variant.partner}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {regular.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <p className="text-[10px] uppercase tracking-[0.25em] text-grey-500 mb-4">
                    All demos
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map((demo) => (
                    <DemoCard
                      key={demo.id}
                      demo={demo}
                      partner={variant.partner}
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
    <div className="text-center py-20 md:py-24 border border-dashed border-milk/10 rounded-2xl">
      <div className="text-4xl mb-4 opacity-50">◯</div>
      <p className="text-sm uppercase tracking-[0.2em] text-grey-500 mb-4">
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

/* Re-export for hub pages */
export { MicrosoftSquares };
