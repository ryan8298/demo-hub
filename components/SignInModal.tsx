'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/HubShared';
import { getBypassLogin } from '@/lib/bypass-logins';

/**
 * Email / OTP (+ demo-bypass) sign-in modal. Extracted from the landing page
 * so it can be reused anywhere a "Sign in to view live demos" CTA appears
 * (landing, /offerings, marketing nav).
 *
 * Self-contained: the parent only controls open/onClose.
 */
export function SignInModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
  const router = useRouter();

  const bypass = getBypassLogin(formData.email);

  function close() {
    // Reset transient UI state so the next open starts clean.
    setError('');
    setInfo('');
    setCode('');
    setStep('profile');
    onClose();
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
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
    <Modal open={open} onClose={close} labelledBy="signin-modal-title">
      <button
        type="button"
        onClick={close}
        className="absolute top-4 right-4 w-8 h-8 rounded-full border border-milk/15 flex items-center justify-center text-milk/60 hover:text-sea-foam hover:border-sea-foam transition"
        aria-label="Close"
      >
        ✕
      </button>
      <p className="text-xs uppercase tracking-[0.25em] text-sage mb-3">
        {step === 'profile' ? 'Access Demos' : 'Verify your email'}
      </p>
      <h2 id="signin-modal-title" className="font-serif text-3xl text-milk mb-2 leading-tight">
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
          {!bypass && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                autoComplete="given-name"
                className="input-field"
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
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
        By continuing, you agree to our{' '}
        <a href="/legal/terms" className="text-grey-400 hover:text-sea-foam transition">
          Terms
        </a>
        .
      </p>
    </Modal>
  );
}
