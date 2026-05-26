'use client';

import { useEffect, useMemo, useState } from 'react';
import { Demo } from '@/lib/types';

export default function CustomerHub() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');

  useEffect(() => {
    fetch('/api/demos?audience=customer')
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
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f3]">
        <div className="text-center">
          <div className="spinner mx-auto" />
          <p className="mt-4 text-[#5c6360] text-sm">Loading solutions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f3]">
      {/* Nav */}
      <nav className="border-b border-[#e2e0d3] bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#7fac3d] flex items-center justify-center text-white font-bold">E</div>
            <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">Echelix</span>
          </a>
          <span className="text-sm text-[#5c6360]">Solution Demos</span>
        </div>
      </nav>

      {/* Hero / Header */}
      <header className="bg-grid border-b border-[#e2e0d3]">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5e0] text-[#6a9530] text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7fac3d] animate-pulse" />
            Customer Demo Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3 text-[#1a1a1a]">
            Solutions built for your business.
          </h1>
          <p className="text-lg text-[#5c6360] max-w-2xl">
            Explore live, interactive demonstrations of Echelix solutions. Click any tile to see ROI summaries, implementation timelines, and open the full demo.
          </p>

          {/* Search + Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search demos…"
                className="input-field pl-10"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8f8c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z" />
              </svg>
            </div>
            <div className="flex gap-2 flex-wrap">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`text-xs font-semibold px-3 py-2 rounded-full transition border ${
                    industryFilter === ind
                      ? 'bg-[#7fac3d] text-white border-[#7fac3d]'
                      : 'bg-white text-[#5c6360] border-[#e2e0d3] hover:border-[#7fac3d]'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#e2e0d3]">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-[#5c6360]">No demos match your filters yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((demo) => (
              <DemoCard
                key={demo.id}
                demo={demo}
                expanded={expandedId === demo.id}
                onToggle={() =>
                  setExpandedId(expandedId === demo.id ? null : demo.id)
                }
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[#e2e0d3] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#7fac3d] flex items-center justify-center text-white font-bold text-xs">E</div>
            <span className="font-semibold text-sm text-[#1a1a1a]">Echelix Demo Hub</span>
          </div>
          <p className="text-xs text-[#8a8f8c]">Modernize. Build Agentic Apps. Deliver Business Value.</p>
        </div>
      </footer>
    </div>
  );
}

function DemoCard({
  demo,
  expanded,
  onToggle,
}: {
  demo: Demo;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [iframeError, setIframeError] = useState(false);

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-[#e2e0d3] card-hover flex flex-col">
      {/* Preview */}
      <div className="relative w-full h-52 bg-gradient-to-br from-[#b2eeda] via-[#d9f0c7] to-[#7fac3d] overflow-hidden">
        {demo.preview_image_url && !iframeError ? (
          <img
            src={demo.preview_image_url}
            alt={demo.title}
            className="w-full h-full object-cover"
            onError={() => setIframeError(true)}
          />
        ) : demo.demo_url && !iframeError ? (
          <>
            <iframe
              src={demo.demo_url}
              className="demo-preview-frame"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              title={`${demo.title} preview`}
              onError={() => setIframeError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-4xl mb-2">🚀</div>
            <p className="text-sm font-semibold opacity-90">Demo Preview</p>
          </div>
        )}
        {demo.featured && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/95 text-[#6a9530] shadow">
            ★ Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={demo.industry ? 'badge' : 'badge badge-muted'}>
            {demo.industry || 'General'}
          </span>
        </div>

        <h3 className="text-lg font-bold leading-snug mb-2 text-[#1a1a1a]">
          {demo.title}
        </h3>
        <p className="text-sm text-[#5c6360] line-clamp-3 mb-5">
          {demo.description || 'Interactive solution demonstration.'}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <a
            href={demo.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm flex-1"
          >
            Open Demo →
          </a>
          <button
            onClick={onToggle}
            className="btn-secondary text-sm"
            aria-expanded={expanded}
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-[#e2e0d3] space-y-5">
            {demo.roi_summary && (
              <div className="p-4 rounded-lg bg-[#f0f8ed] border border-[#d6ebc4]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6a9530] mb-2">
                  💰 ROI Summary
                </h4>
                <p className="text-sm text-[#1a1a1a]">{demo.roi_summary}</p>
              </div>
            )}

            {demo.deployment_timeline && demo.deployment_timeline.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a] mb-3">
                  📅 Implementation Timeline
                </h4>
                <div className="space-y-2">
                  {demo.deployment_timeline.map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7fac3d] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-[#1a1a1a]">{phase.phase}</span>
                        <span className="text-[#5c6360]"> — {phase.duration}</span>
                        {phase.details && (
                          <p className="text-xs text-[#8a8f8c] mt-0.5">{phase.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
