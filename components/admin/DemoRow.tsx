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
      {/* Thumbnail — falls back to the demo's first letter so admins can
          tell at a glance which demos need a preview image set */}
      <td className="py-4 pl-4 md:pl-6 pr-2 w-16 md:w-20">
        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden bg-gradient-to-br from-sage via-sage-dark to-black flex items-center justify-center">
          {demo.preview_image_url ? (
            <Image
              src={demo.preview_image_url}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
              unoptimized={demo.preview_image_url.startsWith('http')}
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
      </td>

      {/* Title + slug */}
      <td className="py-4 px-2 md:px-4 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {demo.featured && (
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
        <a
          href={`/admin/demo/${demo.id}/edit`}
          className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition mr-4"
        >
          Edit
        </a>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-error transition disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </td>
    </tr>
  );
}
