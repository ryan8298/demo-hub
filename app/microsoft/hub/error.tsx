'use client';

import { useEffect } from 'react';
import { HubNav, HubFooter } from '@/components/HubShared';

export default function MicrosoftHubError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Microsoft hub failed to render:', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen text-milk">
      <HubNav label="Partner Hub" partner />
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 pt-44 pb-20">
        <div className="text-center py-24 border border-dashed border-error/30 rounded-2xl bg-error/5">
          <p className="text-xs uppercase tracking-[0.25em] text-error mb-3">
            Couldn&apos;t load partner demos
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-milk mb-6">
            Hit a snag fetching the catalog.
          </h1>
          <button onClick={reset} className="btn-pill">
            Try again
          </button>
        </div>
      </main>
      <HubFooter />
    </div>
  );
}
