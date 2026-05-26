'use client';

/**
 * Global error boundary. Renders for uncaught errors anywhere in the
 * route tree that aren't caught by a more specific error.tsx.
 *
 * The `reset` callback re-attempts the failed segment without a full
 * page reload — useful for transient errors (Supabase blip, etc).
 */
import { useEffect } from 'react';
import { EchelixLogo } from '@/components/HubShared';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in Vercel Logs. `digest` is a stable per-error hash from
    // Next that we can correlate against the server-side log entry.
    console.error('Unhandled error in route segment:', {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-milk flex flex-col">
      <nav className="border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-5 flex items-center">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-7 md:h-8 w-auto" />
          </a>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6 bg-wave relative">
        <div className="relative max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-error mb-4">
            Something went wrong
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-milk leading-tight mb-4">
            We hit an unexpected error.
          </h1>
          <p className="text-sm text-grey-400 mb-8">
            The team has been notified. You can retry the page or head back home.
          </p>
          <div className="flex gap-3 items-center justify-center">
            <button onClick={reset} className="btn-pill">
              Try again
            </button>
            <a href="/" className="btn-ghost">
              Go home
            </a>
          </div>
          {error.digest && (
            <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-grey-600">
              Reference: {error.digest}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
