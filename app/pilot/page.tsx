'use client';

import { useState } from 'react';
import { EchelixLogo } from '@/components/HubShared';
import { SiteFooter } from '@/components/SiteFooter';

const INDUSTRIES = [
  'Energy', 'Oil & Gas', 'Utilities', 'Finance & Banking', 'Healthcare',
  'Retail & E-Commerce', 'Manufacturing', 'Professional Services',
  'Technology', 'Government', 'Education', 'Enterprise', 'Other',
];

export default function PilotPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company_name: '',
    industry: '',
    use_case: '',
    current_pain: '',
    desired_outcome: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pilot/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source_path: '/pilot' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setDone(true);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-milk">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-16 md:h-20 w-auto" />
          </a>
          <a
            href="/"
            className="text-[10px] uppercase tracking-[0.25em] text-grey-400 hover:text-sea-foam transition"
          >
            ← Back to site
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-wave relative pt-40 pb-14 border-b hairline">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            Embedded Agent Pilot
          </p>
          <h1 className="editorial font-serif text-[clamp(2.25rem,6vw,4.5rem)] text-milk leading-[1.05] mb-6 max-w-3xl">
            Have a use case? We&apos;ll{' '}
            <em className="text-sea-foam not-italic">prototype it</em> in under a week.
          </h1>
          <p className="text-base md:text-lg text-grey-300 max-w-2xl leading-relaxed">
            Tell us the workflow you wish ran itself. Selected submissions get a
            free, custom agentic prototype — built on the same Echelix Lattice
            foundation you see across the demo hub, tailored to your environment,
            in days not quarters.
          </p>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-16">
        {/* How it works */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-5">
            How it works
          </p>
          <ol className="space-y-6">
            {[
              { n: '01', t: 'You describe the workflow', d: 'The more concrete the pain and the desired outcome, the better the prototype.' },
              { n: '02', t: 'We scope a thin slice', d: 'We pick the highest-leverage agentic moment and design a focused demo around it.' },
              { n: '03', t: 'You see it live in <1 week', d: 'A working, clickable prototype on the Echelix Lattice + Azure stack — yours to react to.' },
            ].map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="text-xs tracking-[0.25em] text-sage pt-1">{s.n}</span>
                <div>
                  <h3 className="font-serif text-xl text-milk mb-1">{s.t}</h3>
                  <p className="text-sm text-grey-400 leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-grey-600 leading-relaxed mt-8">
            Don&apos;t include confidential information unless we have a written
            agreement in place. Submissions are handled per our{' '}
            <a href="/legal/privacy" className="text-sea-foam hover:underline">Privacy Policy</a>{' '}
            and{' '}
            <a href="/legal/terms" className="text-sea-foam hover:underline">Terms</a>.
          </p>
        </section>

        {/* Form / success */}
        <section>
          {done ? (
            <div className="card p-8 md:p-10 border-l-2 border-sea-foam/40">
              <p className="text-[10px] uppercase tracking-[0.25em] text-sea-foam mb-3">
                Submission received
              </p>
              <h2 className="font-serif text-3xl text-milk mb-4 leading-tight">
                Thanks — we&apos;re on it.
              </h2>
              <p className="text-sm text-grey-300 leading-relaxed mb-6">
                Our team reviews every submission. If your use case is a fit for
                a pilot prototype, we&apos;ll reach out at{' '}
                <span className="text-milk">{form.email}</span> to confirm scope
                and timing.
              </p>
              <a href="/" className="btn-pill">Back to the demo hub →</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-4">
              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg text-xs bg-error/10 text-error border border-error/30 whitespace-pre-wrap"
                >
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Your name" required>
                  <input
                    type="text" required autoComplete="name"
                    value={form.name} onChange={(e) => update('name', e.target.value)}
                    className="input-field" placeholder="Jordan Rivera"
                  />
                </Field>
                <Field label="Work email" required>
                  <input
                    type="email" required autoComplete="email"
                    value={form.email} onChange={(e) => update('email', e.target.value)}
                    className="input-field" placeholder="you@company.com"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company">
                  <input
                    type="text" autoComplete="organization"
                    value={form.company_name} onChange={(e) => update('company_name', e.target.value)}
                    className="input-field" placeholder="Acme Industrial"
                  />
                </Field>
                <Field label="Industry">
                  <select
                    value={form.industry} onChange={(e) => update('industry', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select…</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="The use case you want demoed" required>
                <textarea
                  required rows={4}
                  value={form.use_case} onChange={(e) => update('use_case', e.target.value)}
                  className="input-field resize-y"
                  placeholder="The workflow or decision you'd like an agent team to handle…"
                />
              </Field>

              <Field label="What's painful about it today?">
                <textarea
                  rows={3}
                  value={form.current_pain} onChange={(e) => update('current_pain', e.target.value)}
                  className="input-field resize-y"
                  placeholder="Manual steps, disconnected systems, time/cost, error rates…"
                />
              </Field>

              <Field label="What would success look like?">
                <textarea
                  rows={3}
                  value={form.desired_outcome} onChange={(e) => update('desired_outcome', e.target.value)}
                  className="input-field resize-y"
                  placeholder="The outcome or metric that would make this a win…"
                />
              </Field>

              <button type="submit" disabled={loading} className="btn-pill w-full mt-2">
                {loading ? 'Submitting…' : 'Submit my use case →'}
              </button>
            </form>
          )}
        </section>
      </main>

      <SiteFooter showCta={false} />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-grey-400 mb-1.5 block">
        {label} {required && <span className="text-sea-foam">*</span>}
      </span>
      {children}
    </label>
  );
}
