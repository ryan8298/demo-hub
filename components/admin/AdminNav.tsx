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
          <EchelixLogo className="h-20 md:h-24 w-auto" />
        </a>
        <div className="flex items-center gap-3 md:gap-4">
          <a href="/admin" className={linkClass(current === 'index')}>
            All demos
          </a>
          <a href="/admin/demo/add" className={linkClass(current === 'add')}>
            Publish new
          </a>

          {/* Preview links — open hubs in a new tab without logging out
              of admin. Proxy lets the admin cookie through. */}
          <span className="hidden md:inline-block w-px h-3 bg-milk/15" />
          <a
            href="/customer/hub"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass(false)} hidden md:inline`}
            title="Open the customer hub in a new tab"
          >
            ↗ Customer
          </a>
          <a
            href="/microsoft/hub"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass(false)} hidden md:inline`}
            title="Open the Microsoft partner hub in a new tab"
          >
            ↗ Microsoft
          </a>
          <span className="hidden md:inline-block w-px h-3 bg-milk/15" />

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
