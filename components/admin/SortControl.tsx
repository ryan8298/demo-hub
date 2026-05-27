'use client';

import { useRouter } from 'next/navigation';

/**
 * Sort dropdown for /admin. Drives the order via the `?sort=` URL search
 * param so it survives refreshes and shares cleanly. Server-side handler
 * lives in app/admin/page.tsx (applySort()).
 */
export type SortKey =
  | 'title-asc'
  | 'title-desc'
  | 'newest'
  | 'oldest'
  | 'featured';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'title-asc', label: 'Title A–Z' },
  { key: 'title-desc', label: 'Title Z–A' },
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'featured', label: 'Featured first' },
];

export function SortControl({ current }: { current: SortKey }) {
  const router = useRouter();
  return (
    <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-grey-500">
      Sort
      <select
        value={current}
        onChange={(e) => {
          const next = e.target.value;
          // 'title-asc' is the default — keep the URL clean by omitting it.
          const url = next === 'title-asc' ? '/admin' : `/admin?sort=${next}`;
          router.push(url);
        }}
        className="bg-black/40 border border-milk/15 rounded px-2 py-1.5 text-[11px] text-milk normal-case tracking-normal focus:outline-none focus:border-sea-foam/50"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
