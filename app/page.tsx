'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EchelixLogo } from '@/components/HubShared';

export default function Landing() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: ''
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

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
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
        const base = data.error || 'Verification failed.';
        // TEMP DEBUG: append raw Supabase error so we can diagnose flow issues
        const dbg = data.debug ? `\n\nDebug: ${JSON.stringify(data.debug)}` : '';
        setError(base + dbg);
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
    <div className="min-h-screen bg-black text-[#F3F3E9]">
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-7 md:h-8 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full border border-[#F3F3E9]/20 flex items-center justify-center text-[#F3F3E9]/70 hover:border-[#B2EEDA] hover:text-[#B2EEDA] transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z" />
              </svg>
            </button>
            <button onClick={() => openModal()} className="btn-pill">
              Menu
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-32 overflow-hidden">
        {/* Wave background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/wave-bg.jpg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-65"
            aria-hidden="true"
          />
          {/* Gradient overlays to fade wave into black at top/bottom and keep text legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50" />
        </div>
        <div className="max-w-[1400px] mx-auto px-8 relative z-10 w-full">
          <div className="max-w-5xl">
            <h1 className="editorial font-serif text-[clamp(2.5rem,7vw,6.5rem)] text-[#F3F3E9] mb-8">
              Experience the future of <em className="text-[#B2EEDA] not-italic">agentic</em> enterprise software.
            </h1>
            <p className="text-base md:text-lg text-[#B2AEAF] max-w-2xl mb-10 leading-relaxed">
              Explore live, interactive demonstrations of Echelix solutions — purpose-built to modernize operations, embed AI, and deliver measurable business value, fast.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={() => openModal()} className="btn-pill">
                Access Demos →
              </button>
              <a href="#features" className="btn-ghost">
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator (left edge) */}
        <div className="absolute left-8 bottom-12 flex items-center gap-3">
          <span className="block w-12 h-px bg-[#F3F3E9]/30" />
          <span className="scroll-indicator">Scroll</span>
        </div>

        {/* Social icons (right edge) */}
        <div className="absolute right-8 bottom-12 flex flex-col gap-4 text-[#F3F3E9]/40">
          <span className="text-xs">X</span>
          <span className="text-xs">in</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            <p className="md:col-span-3 text-xs uppercase tracking-[0.25em] text-[#7FAC9D]">
              Why Echelix
            </p>
            <h2 className="md:col-span-9 font-serif text-3xl md:text-5xl text-[#F3F3E9] leading-tight">
              Solutions engineered for the next era of enterprise — agentic, integrated, measurable.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F3F3E9]/10 border hairline">
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
              <div key={f.num} className="bg-black p-10 hover:bg-[#0a0a0a] transition">
                <div className="text-xs tracking-[0.25em] text-[#7FAC9D] mb-6">{f.num}</div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#F3F3E9] mb-4">{f.title}</h3>
                <p className="text-sm text-[#8B8586] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-8 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7FAC9D] mb-6">
            Ready When You Are
          </p>
          <h2 className="font-serif text-4xl md:text-6xl text-[#F3F3E9] mb-8 max-w-3xl mx-auto leading-[1.05]">
            See what <em className="text-[#B2EEDA] not-italic">agentic</em> looks like in production.
          </h2>
          <button onClick={() => openModal()} className="btn-pill">
            Access Demos →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t hairline">
        <div className="max-w-[1400px] mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <EchelixLogo className="h-5 w-auto opacity-80" />
          <p className="text-xs text-[#605A5B]">
            Modernize. Build Agentic Apps. Deliver Business Value.
          </p>
        </div>
      </footer>

      {/* Sign-in Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/80 backdrop-blur"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0a0a0a] border border-[#F3F3E9]/10 rounded-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#F3F3E9]/15 flex items-center justify-center text-[#F3F3E9]/60 hover:text-[#B2EEDA] hover:border-[#B2EEDA] transition"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7FAC9D] mb-3">
              {step === 'profile' ? 'Access Demos' : 'Verify your email'}
            </p>
            <h2 className="font-serif text-3xl text-[#F3F3E9] mb-2 leading-tight">
              {step === 'profile' ? 'Step inside the hub.' : 'Check your inbox.'}
            </h2>
            <p className="text-sm text-[#8B8586] mb-6">
              {step === 'profile'
                ? "Enter your details — we'll send a verification code to your email."
                : `Enter the verification code we sent to ${formData.email}.`}
            </p>

            {error && (
              <div className="p-3 mb-3 rounded-lg text-xs bg-[#CD3232]/10 text-[#CD3232] border border-[#CD3232]/30 whitespace-pre-wrap break-words">
                {error}
              </div>
            )}
            {info && !error && (
              <div className="p-3 mb-3 rounded-lg text-xs bg-[#B2EEDA]/8 text-[#B2EEDA] border border-[#B2EEDA]/25">
                {info}
              </div>
            )}

            {step === 'profile' ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Work email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                  className="input-field"
                />

                {isMicrosoftEmail && (
                  <div className="p-3 rounded-lg text-xs bg-[#B2EEDA]/8 text-[#B2EEDA] border border-[#B2EEDA]/25">
                    ✓ Microsoft account detected — you&apos;ll be routed to the Partner Hub.
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Company name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                  className="input-field"
                />

                <button type="submit" disabled={loading} className="btn-pill w-full mt-2">
                  {loading ? 'Sending code…' : 'Send Verification Code →'}
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
                  // Strip non-digits and cap at 10 (Supabase OTP can be 6-8 by config).
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  autoFocus
                  className="input-field text-center text-2xl tracking-[0.4em] font-mono"
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
                    className="text-xs uppercase tracking-[0.2em] text-[#8B8586] hover:text-[#B2EEDA] transition"
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-xs uppercase tracking-[0.2em] text-[#8B8586] hover:text-[#B2EEDA] transition disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-[10px] uppercase tracking-[0.2em] mt-5 text-[#605A5B]">
              By continuing, you agree to our Terms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
