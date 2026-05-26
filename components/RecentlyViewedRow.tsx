'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Demo } from '@/lib/types';
import { clearRecentlyViewed, pickRecentlyViewed } from '@/lib/recently-viewed';
import { trackDemoEvent } from '@/lib/track';

/**
 * "Continue exploring" row at the top of the hub. Sourced from the
 * client-side recently-viewed list. Renders nothing on first paint
 * (and on visitors who have no history) so it doesn't take vertical
 * space when there's nothing to show.
 */
export function RecentlyViewedRow({ demos }: { demos: Demo[] }) {
  const [recent, setRecent] = useState<Demo[]>([]);

  useEffect(() => {
    const refresh = () => setRecent(pickRecentlyViewed(demos).slice(0, 4));
    refresh();
    window.addEventListener('echelix:recentlyViewed:changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('echelix:recentlyViewed:changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [demos]);

  if (recent.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-sage">
          ↻ Continue exploring
        </p>
        <button
          type="button"
          onClick={() => clearRecentlyViewed()}
          className="text-[10px] uppercase tracking-[0.2em] text-grey-500 hover:text-error transition"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recent.map((demo) => (
          <a
            key={demo.id}
            href={demo.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackDemoEvent(demo.id, 'click')}
            className="card card-lift overflow-hidden flex flex-col group"
          >
            <div className="relative w-full h-24 md:h-28 bg-gradient-to-br from-sage via-sage-dark to-black">
              {demo.preview_image_url && (
                <Image
                  src={demo.preview_image_url}
                  alt={demo.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized={demo.preview_image_url.startsWith('http')}
                />
              )}
            </div>
            <div className="p-3">
              <h3 className="font-serif text-sm text-milk leading-snug line-clamp-2 group-hover:text-sea-foam transition">
                {demo.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
