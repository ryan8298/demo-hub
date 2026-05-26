'use client';

import { useRouter } from 'next/navigation';
import { EchelixLogo } from '@/components/HubShared';

/**
 * Shared nav for all admin pages — logo, current view label, "All demos"
 * link, and Sign Out. Used by /admin, /admin/demo/add, /admin/demo/[id]/edit.
 */
export function AdminNav({ current }: { current: 'index' | 'add' | 'edit' }) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });
    router.push('/admin/login');
    router.refresh();
  }

  const linkClass = (active: boolean) =>
    `text-[10px] uppercase tracking-[0.25em] transition ${
      active ? 'text-sea-foam' : 'text-grey-400 hover:text-sea-foam'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <EchelixLogo className="h-7 md:h-8 w-auto" />
        </a>
        <div className="flex items-center gap-4">
          <a href="/admin" className={linkClass(current === 'index')}>
            All demos
          </a>
          <a href="/admin/demo/add" className={linkClass(current === 'add')}>
            Publish new
          </a>
          <span className="badge">Admin</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
