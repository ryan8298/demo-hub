'use client';

import { useState } from 'react';
import { Demo } from '@/lib/types';

export function EchelixLogo({ className = 'h-7' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/echelix-logo.png"
      alt="Echelix"
      width={1200}
      height={500}
      className={className}
      decoding="async"
      loading="eager"
    />
  );
}

export function HubNav({ label, partner }: { label: string; partner?: boolean }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
      <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <EchelixLogo className="h-7 md:h-8 w-auto" />
        </a>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#706A6B] hidden md:block">
            {label}
          </span>
          {partner && (
            <span className="badge">
              <svg viewBox="0 0 23 23" className="w-2.5 h-2.5">
                <rect width="10" height="10" fill="#f25022" />
                <rect x="11" width="10" height="10" fill="#7fba00" />
                <rect y="11" width="10" height="10" fill="#00a4ef" />
                <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
              </svg>
              Microsoft Partner
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export function HubFooter() {
  return (
    <footer className="border-t hairline">
      <div className="max-w-[1400px] mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <EchelixLogo className="h-5 w-auto opacity-80" />
        </div>
        <p className="text-xs text-[#605A5B]">
          Modernize. Build Agentic Apps. Deliver Business Value.
        </p>
      </div>
    </footer>
  );
}

export function DemoCard({
  demo,
  expanded,
  onToggle,
  partner = false,
}: {
  demo: Demo;
  expanded: boolean;
  onToggle: () => void;
  partner?: boolean;
}) {
  const [iframeError, setIframeError] = useState(false);

  return (
    <article className="card card-lift overflow-hidden flex flex-col">
      <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-[#7FAC9D] via-[#5F8A7C] to-[#020202]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F3F3E9]/80">
            <div className="text-3xl mb-2 font-serif">◆</div>
            <p className="text-[10px] uppercase tracking-[0.2em]">Demo Preview</p>
          </div>
        )}

        {demo.featured && (
          <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[#B2EEDA] border border-[#B2EEDA]/30">
            ★ Featured
          </span>
        )}
        {partner && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-medium px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[#F3F3E9] border border-[#F3F3E9]/20">
            <svg viewBox="0 0 23 23" className="w-2 h-2">
              <rect width="10" height="10" fill="#f25022" />
              <rect x="11" width="10" height="10" fill="#7fba00" />
              <rect y="11" width="10" height="10" fill="#00a4ef" />
              <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
            </svg>
            Co-Sell
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={demo.industry ? 'badge badge-sage' : 'badge badge-muted'}>
            {demo.industry || 'General'}
          </span>
        </div>

        <h3 className="font-serif text-2xl text-[#F3F3E9] leading-tight mb-3">
          {demo.title}
        </h3>
        <p className="text-sm text-[#8B8586] line-clamp-3 mb-6 leading-relaxed">
          {demo.description || 'Interactive solution demonstration.'}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <a
            href={demo.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill text-xs flex-1"
          >
            Open Demo →
          </a>
          <button onClick={onToggle} className="btn-ghost text-xs" aria-expanded={expanded}>
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t hairline space-y-5">
            {demo.roi_summary && (
              <div className="p-4 rounded-lg bg-[#B2EEDA]/5 border border-[#B2EEDA]/15">
                <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B2EEDA] mb-2">
                  ROI Summary
                </h4>
                <p className="text-sm text-[#F3F3E9] leading-relaxed">{demo.roi_summary}</p>
              </div>
            )}

            {demo.deployment_timeline && demo.deployment_timeline.length > 0 && (
              <div>
                <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#7FAC9D] mb-3">
                  Implementation Timeline
                </h4>
                <div className="space-y-3">
                  {demo.deployment_timeline.map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B2EEDA] mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-[#F3F3E9]">{phase.phase}</span>
                        <span className="text-[#8B8586]"> — {phase.duration}</span>
                        {phase.details && (
                          <p className="text-xs text-[#706A6B] mt-1 leading-relaxed">{phase.details}</p>
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
