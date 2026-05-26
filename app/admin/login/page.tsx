'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EchelixLogo } from '@/components/HubShared';

// Wrapping component because useSearchParams() bails out of static
// generation unless it's inside a Suspense boundary (Next 16 strict mode).
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="spinner" />
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin/demo/add';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid credentials');
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#F3F3E9] flex flex-col">
      {/* Minimal top bar */}
      <nav className="border-b hairline">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-7 md:h-8 w-auto" />
          </a>
          <span className="badge badge-muted">Admin</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 bg-wave relative">
        <div className="relative w-full max-w-md card p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7FAC9D] mb-3">
            Admin Console
          </p>
          <h1 className="font-serif text-3xl text-[#F3F3E9] leading-tight mb-2">
            Sign in to continue.
          </h1>
          <p className="text-sm text-[#8B8586] mb-6">
            Enter the admin password to manage demos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm bg-[#CD3232]/10 text-[#CD3232] border border-[#CD3232]/30">
                {error}
              </div>
            )}
            <input
              type="password"
              autoComplete="current-password"
              autoFocus
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" disabled={loading || !password} className="btn-pill w-full">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-[10px] uppercase tracking-[0.2em] mt-6 text-[#605A5B] text-center">
            Authorized personnel only.
          </p>
        </div>
      </main>
    </div>
  );
}
