'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Demo } from '@/lib/types';
import { trackDemoEvent } from '@/lib/track';
import { rememberDemoView } from '@/lib/recently-viewed';

/**
 * Interactive layer of the public /demo/[slug] page.
 *  • Fires a 'view' tracking event on mount
 *  • Renders the embedded iframe preview with fallback
 *  • Owns the share-link button (copies URL to clipboard)
 */
export function PublicDemoView({ demo }: { demo: Demo }) {
  const [iframeError, setIframeError] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    trackDemoEvent(demo.id, 'view');
    rememberDemoView(demo);
  }, [demo.id, demo]);

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      // Clipboard API can be blocked — fallback to prompt
      window.prompt('Copy this link:', url);
    }
  }

  return (
    <>
      {/* Preview — large hero embed */}
      <div className="relative w-full h-[420px] md:h-[560px] rounded-2xl overflow-hidden bg-gradient-to-br from-sage via-sage-dark to-black border hairline">
        {demo.preview_image_url && !iframeError ? (
          <Image
            src={demo.preview_image_url}
            alt={demo.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            className="object-cover"
            unoptimized={demo.preview_image_url.startsWith('http')}
            onError={() => setIframeError(true)}
          />
        ) : demo.demo_url && !iframeError ? (
          <>
            <iframe
              src={demo.demo_url}
              className="absolute top-0 left-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
              sandbox="allow-scripts"
              loading="lazy"
              title={`${demo.title} preview`}
              onError={() => setIframeError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-milk/80">
            <div className="text-6xl mb-3 font-serif">◆</div>
            <p className="text-xs uppercase tracking-[0.25em]">Demo Preview</p>
          </div>
        )}
      </div>

      {/* Primary actions */}
      <div className="flex flex-wrap items-center gap-3 mt-8">
        <a
          href={demo.demo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill"
          onClick={() => trackDemoEvent(demo.id, 'click')}
        >
          Open Demo →
        </a>
        <button type="button" onClick={handleShare} className="btn-ghost">
          {shared ? '✓ Link copied' : 'Copy share link'}
        </button>
      </div>
    </>
  );
}
