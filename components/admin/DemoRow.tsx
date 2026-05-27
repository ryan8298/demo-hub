'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Demo } from '@/lib/types';

/**
 * One row in the admin index table. Client component because it owns the
 * delete confirmation flow.
 */
export function DemoRow({ demo }: { demo: Demo }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  // Optimistic local state for the featured toggle so the star flips
  // instantly on click; reverts on server failure.
  const [featured, setFeatured] = useState<boolean>(!!demo.featured);
  const [togglingFeatured, setTogglingFeatured] = useState(false);

  async function handleToggleFeatured() {
    if (togglingFeatured) return;
    const next = !featured;
    setFeatured(next); // optimistic
    setTogglingFeatured(true);
    setError('');
    try {
      const res = await fetch(`/api/demo/${demo.id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: next }),
      });
      if (res.status === 401) {
        router.push('/admin/login?next=/admin');
        return;
      }
      if (!res.ok) {
        setFeatured(!next); // revert
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not update featured state');
        return;
      }
      // Refresh the SSR page so the stats strip at the top updates too.
      router.refresh();
    } catch {
      setFeatured(!next);
      setError('Network error');
    } finally {
      setTogglingFeatured(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      `Delete "${demo.title}"? This cannot be undone.`
    );
    if (!ok) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/demo/${demo.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.status === 401) {
        router.push('/admin/login?next=/admin');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to delete');
        return;
      }
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <tr className="border-t hairline hover:bg-milk/[0.02] transition">
      {/* Thumbnail — matches the public DemoCard logic:
           1. preview_image_url (or prefer_live_preview short-circuit → iframe)
           2. iframe of demo_url (skipped for placeholder URLs)
           3. First-letter fallback so admins can spot demos needing work
         */}
      <td className="py-4 pl-4 md:pl-6 pr-2 w-16 md:w-20">
        <ThumbnailCell demo={demo} />
      </td>

      {/* Title + slug */}
      <td className="py-4 px-2 md:px-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {featured && (
            <span className="text-sea-foam text-[10px]" aria-label="Featured">
              ★
            </span>
          )}
          <h3 className="font-serif text-base md:text-lg text-milk truncate">
            {demo.title}
          </h3>
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-grey-500 truncate font-mono">
          /{demo.slug}
        </p>
        {error && (
          <p className="text-[10px] text-error mt-1" role="alert">
            {error}
          </p>
        )}
      </td>

      {/* Industry */}
      <td className="py-4 px-2 md:px-4 hidden md:table-cell">
        {demo.industry ? (
          <span className="badge badge-sage">{demo.industry}</span>
        ) : (
          <span className="badge badge-muted">General</span>
        )}
      </td>

      {/* Audiences */}
      <td className="py-4 px-2 md:px-4 hidden lg:table-cell">
        <div className="flex gap-1 flex-wrap">
          {demo.audience.map((a) => (
            <span key={a} className="badge badge-muted text-[9px]">
              {a}
            </span>
          ))}
        </div>
      </td>

      {/* Metrics */}
      <td className="py-4 px-2 md:px-4 hidden xl:table-cell whitespace-nowrap">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-grey-400">
          <span title="Detail-page views">
            <span className="text-milk font-mono">{demo.view_count ?? 0}</span> views
          </span>
          <span title="Open Demo clicks">
            <span className="text-sea-foam font-mono">{demo.click_count ?? 0}</span> opens
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 pl-2 pr-4 md:pr-6 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={handleToggleFeatured}
          disabled={togglingFeatured}
          aria-pressed={featured}
          aria-label={featured ? 'Unfeature this demo' : 'Feature this demo'}
          title={featured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
          className={`inline-flex items-center justify-center w-7 h-7 align-middle mr-3 rounded transition disabled:opacity-50 ${
            featured
              ? 'text-sea-foam hover:text-sea-foam-dark'
              : 'text-grey-500 hover:text-sea-foam'
          }`}
        >
          {/* Star icon — fills when featured, outline when not */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill={featured ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={featured ? 0 : 1.8}
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2.6l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.7l-5.9 3.1 1.13-6.58L2.45 9.54l6.6-.96L12 2.6z" />
          </svg>
        </button>
        <a
          href={`/admin/demo/${demo.id}/edit`}
          className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition mr-4 align-middle"
        >
          Edit
        </a>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-error transition disabled:opacity-50 align-middle"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </td>
    </tr>
  );
}

/**
 * Thumbnail with three render paths matching the public DemoCard
 * logic. Lives at the bottom of this file because it's only used here.
 */
function ThumbnailCell({ demo }: { demo: Demo }) {
  const [iframeError, setIframeError] = useState(false);

  // Placeholder URLs from the bulk-seed don't render anything useful in
  // an iframe — show the letter fallback instead until the admin sets
  // the real demo_url.
  const isPlaceholder =
    !!demo.demo_url && demo.demo_url.startsWith('https://placeholder.echelix.app');

  const wantsLive =
    !!demo.prefer_live_preview && !!demo.demo_url && !isPlaceholder;
  const showLiveFrame = wantsLive && !iframeError;
  const showImage =
    !showLiveFrame && !!demo.preview_image_url && !iframeError;
  const showFallbackFrame =
    !showLiveFrame &&
    !showImage &&
    !!demo.demo_url &&
    !isPlaceholder &&
    !iframeError;

  return (
    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden bg-gradient-to-br from-sage via-sage-dark to-black flex items-center justify-center">
      {showImage ? (
        <Image
          src={demo.preview_image_url!}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
          unoptimized={demo.preview_image_url!.startsWith('http')}
          onError={() => setIframeError(true)}
        />
      ) : showLiveFrame || showFallbackFrame ? (
        // Heavy scale so the iframe content shrinks into the tiny
        // thumbnail. pointer-events:none so clicks pass through to the
        // row's other controls.
        <iframe
          src={demo.demo_url}
          title=""
          loading="lazy"
          sandbox="allow-scripts"
          onError={() => setIframeError(true)}
          className="absolute top-0 left-0 border-0 pointer-events-none"
          style={{
            width: '400%',
            height: '400%',
            transform: 'scale(0.25)',
            transformOrigin: 'top left',
          }}
        />
      ) : (
        <span
          className="font-serif text-xl md:text-2xl text-milk/80 select-none"
          aria-hidden="true"
          title="No preview image set"
        >
          {(demo.title?.[0] || '·').toUpperCase()}
        </span>
      )}
    </div>
  );
}
