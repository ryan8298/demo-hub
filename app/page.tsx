'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EchelixLogo, Modal } from '@/components/HubShared';
import { getBypassLogin } from '@/lib/bypass-logins';

export default function Landing() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
  });
  const [step, setStep] = useState<'profile' | 'code'>('profile');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isMicrosoftEmail, setIsMicrosoftEmail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  function openModal() {
    setError('');
    setInfo('');
    setCode('');
    setStep('profile');
    setShowForm(true);
  }

  /** Detect the magic demo emails up-front so the UI can reshape itself. */
  const bypass = getBypassLogin(formData.email);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // ---- Bypass branch ----------------------------------------------
      // client@/microsoft@/admin@echelix.com → skip OTP entirely, get the
      // cookie set server-side, and bounce straight to the destination.
      if (bypass) {
        const res = await fetch('/api/auth/bypass-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Could not sign in.');
          return;
        }
        router.push(data.redirect || '/customer/hub');
        return;
      }

      // ---- Standard OTP branch ----------------------------------------
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not send code.');
        return;
      }
      setInfo(`A verification code was sent to ${formData.email}.`);
      setStep('code');
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed.');
        return;
      }
      router.push(data.redirect || '/customer/hub');
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not resend code.');
        return;
      }
      setInfo('New code sent.');
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setIsMicrosoftEmail(email.toLowerCase().endsWith('@microsoft.com'));
  };

  return (
    <div className="min-h-screen text-milk relative">
      {/* Global background lives in app/layout.tsx — no per-page bg needed */}

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-1 md:py-1 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-24 md:h-28 w-auto" />
          </a>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              aria-label="Search"
              className="w-9 h-9 rounded-full border border-milk/20 flex items-center justify-center text-milk/70 hover:border-sea-foam hover:text-sea-foam transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z"
                />
              </svg>
            </button>
            <button onClick={openModal} className="btn-pill">
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — content only. Background is provided by EchelixAtmosphere
          in the root layout. pt > pb so justify-center settles the
          content slightly below true vertical center for a more grounded feel. */}
      <section className="relative min-h-screen flex flex-col justify-center pt-40 pb-16 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10 w-full">
          <div className="text-center max-w-[1100px] mx-auto">
            <h1 className="font-serif text-[clamp(2.75rem,8vw,7rem)] text-white leading-[1.04] tracking-[-0.02em] mb-8">
              Experience the future of{' '}
              <em className="text-sea-foam not-italic">agentic</em> enterprise software.
            </h1>
            <p className="text-base md:text-lg text-grey-200 max-w-2xl mx-auto mb-4 leading-relaxed">
              Hands-on demonstrations of Echelix agentic solutions — built on
              Microsoft Azure, integrated with Microsoft 365, and engineered for
              the enterprise.
            </p>
            <p className="text-base md:text-lg text-grey-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Every tile opens to a one-pager covering the business problem
              it solves, the audience it serves, a solution architecture
              diagram, and ROI. Sign in with your work email to browse the
              full catalog.
            </p>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <button onClick={openModal} className="btn-pill">
                Access Demos →
              </button>
              <a href="#features" className="btn-ghost">
                Learn More
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* Features */}
      <section id="features" className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 md:mb-16">
            <p className="md:col-span-3 text-xs uppercase tracking-[0.25em] text-sage">
              Why Echelix
            </p>
            <h2 className="md:col-span-9 font-serif text-3xl md:text-5xl text-milk leading-tight">
              Solutions engineered for the next era of enterprise — agentic, integrated, measurable.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-milk/10 border hairline">
            {[
              {
                num: '01',
                title: 'Interactive Demos',
                body: 'Live, hands-on demonstrations of every Echelix solution. No slides, no recordings — just real software in real time.',
              },
              {
                num: '02',
                title: 'Secure Access',
                body: 'Enterprise-grade security with seamless Microsoft Teams integration for partners and customers.',
              },
              {
                num: '03',
                title: 'Instant Onboarding',
                body: 'Start exploring in seconds — your email and company name are all we need to get you in.',
              },
            ].map((f) => (
              <div key={f.num} className="bg-black p-8 md:p-10 hover:bg-[#0a0a0a] transition">
                <div className="text-xs tracking-[0.25em] text-sage mb-6">{f.num}</div>
                <h3 className="font-serif text-2xl md:text-3xl text-milk mb-4">{f.title}</h3>
                <p className="text-sm text-grey-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-20 md:py-24 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-6">
            Ready When You Are
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-milk mb-8 max-w-3xl mx-auto leading-[1.05]">
            See what <em className="text-sea-foam not-italic">agentic</em> looks like in production.
          </h2>
          <button onClick={openModal} className="btn-pill">
            Access Demos →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <EchelixLogo className="h-16 w-auto opacity-80" />
          <p className="text-xs text-grey-600">
            Modernize. Build Agentic Apps. Deliver Business Value.
          </p>
        </div>
      </footer>

      {/* Sign-in Modal (a11y: ESC to close, focus trap, scroll lock) */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        labelledBy="signin-modal-title"
      >
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-milk/15 flex items-center justify-center text-milk/60 hover:text-sea-foam hover:border-sea-foam transition"
          aria-label="Close"
        >
          ✕
        </button>
        <p className="text-xs uppercase tracking-[0.25em] text-sage mb-3">
          {step === 'profile' ? 'Access Demos' : 'Verify your email'}
        </p>
        <h2
          id="signin-modal-title"
          className="font-serif text-3xl text-milk mb-2 leading-tight"
        >
          {step === 'profile' ? 'Step inside the hub.' : 'Check your inbox.'}
        </h2>
        <p className="text-sm text-grey-400 mb-6">
          {step === 'profile'
            ? "Enter your details — we'll send a verification code to your email."
            : `Enter the verification code we sent to ${formData.email}.`}
        </p>

        {error && (
          <div
            role="alert"
            className="p-3 mb-3 rounded-lg text-xs bg-error/10 text-error border border-error/30 whitespace-pre-wrap break-words"
          >
            {error}
          </div>
        )}
        {info && !error && (
          <div
            role="status"
            className="p-3 mb-3 rounded-lg text-xs bg-sea-foam/8 text-sea-foam border border-sea-foam/25"
          >
            {info}
          </div>
        )}

        {step === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            {/* Name fields are only shown for the standard OTP flow.
                Bypass logins (client@/microsoft@/admin@echelix.com) just
                need the email. */}
            {!bypass && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                  autoComplete="given-name"
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                  autoComplete="family-name"
                  className="input-field"
                />
              </div>
            )}

            <input
              type="email"
              placeholder="Work email"
              value={formData.email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
              className="input-field"
            />

            {bypass && (
              <div className="p-3 rounded-lg text-xs bg-sage/15 text-sage border border-sage/40">
                ✓ Demo bypass — no verification needed. You&apos;ll go straight to the{' '}
                <span className="font-medium">{bypass.label}</span>.
              </div>
            )}

            {!bypass && isMicrosoftEmail && (
              <div className="p-3 rounded-lg text-xs bg-sea-foam/8 text-sea-foam border border-sea-foam/25">
                ✓ Microsoft account detected — you&apos;ll be routed to the Partner Hub.
              </div>
            )}

            {!bypass && (
              <input
                type="text"
                placeholder="Company name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                required
                autoComplete="organization"
                className="input-field"
              />
            )}

            <button type="submit" disabled={loading} className="btn-pill w-full mt-2">
              {loading
                ? bypass
                  ? 'Signing in…'
                  : 'Sending code…'
                : bypass
                  ? 'Sign In →'
                  : 'Send Verification Code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{4,10}"
              maxLength={10}
              placeholder="••••••"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              autoFocus
              className="input-field text-center text-2xl tracking-[0.4em] font-mono"
              aria-label="Verification code"
            />

            <button
              type="submit"
              disabled={loading || code.length < 4}
              className="btn-pill w-full mt-2"
            >
              {loading ? 'Verifying…' : 'Verify & Enter Hub →'}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep('profile');
                  setError('');
                  setInfo('');
                  setCode('');
                }}
                className="text-xs uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition"
              >
                ← Change email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-xs uppercase tracking-[0.2em] text-grey-400 hover:text-sea-foam transition disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-[10px] uppercase tracking-[0.2em] mt-5 text-grey-600">
          By continuing, you agree to our Terms.
        </p>
      </Modal>
    </div>
  );
}
