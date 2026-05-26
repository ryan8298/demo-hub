'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMicrosoftEmail, setIsMicrosoftEmail] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Sign-up failed');

      await response.json();
      const isMicrosoft = formData.email.toLowerCase().endsWith('@microsoft.com');
      router.push(isMicrosoft ? '/microsoft/hub' : '/customer/hub');
    } catch {
      setError('Failed to sign up. Please try again.');
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
    <div className="min-h-screen bg-[#faf9f3] text-[#1a1a1a]">
      {/* Top Nav */}
      <nav className="border-b border-[#e2e0d3] bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#7fac3d] flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-xl font-bold tracking-tight">Echelix</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-[#5c6360] hidden sm:block">Demo Hub</span>
            <span className="badge">● Live</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Heading */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5e0] text-[#6a9530] text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7fac3d] animate-pulse" />
                Interactive Solution Demonstrations
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.05] tracking-tight">
                Experience the future of <span className="text-[#7fac3d]">agentic</span> enterprise software.
              </h1>
              <p className="text-lg md:text-xl text-[#5c6360] mb-8 max-w-xl">
                Explore hands-on demonstrations of Echelix solutions — purpose-built to modernize operations, accelerate AI adoption, and deliver measurable business value.
              </p>
              <div className="flex flex-wrap gap-3 mb-2">
                <span className="badge">🚀 Live Demos</span>
                <span className="badge">🏢 Enterprise Ready</span>
                <span className="badge">🔵 Microsoft Partner</span>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_32px_-8px_rgba(10,15,13,0.12)] border border-[#e2e0d3]">
                <h2 className="text-2xl font-bold mb-1">Access the Demo Hub</h2>
                <p className="text-sm text-[#5c6360] mb-6">
                  Enter your details to explore live solution demos.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg text-sm bg-[#fde9e9] text-[#cd3232] border-l-4 border-[#cd3232]">
                      {error}
                    </div>
                  )}

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
                    <div className="p-3 rounded-lg text-sm bg-[#e8f5e0] text-[#6a9530] flex items-center gap-2 border-l-4 border-[#7fac3d]">
                      <span>✓</span>
                      <span>Microsoft account detected — you&apos;ll get the Microsoft Partner hub.</span>
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

                  <button type="submit" disabled={loading} className="btn-primary w-full text-base">
                    {loading ? 'Signing you in…' : 'Explore Demos →'}
                  </button>
                </form>

                <p className="text-center text-xs mt-4 text-[#8a8f8c]">
                  By accessing demos, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-[#f3f3e9] border-y border-[#e2e0d3]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Interactive Demos', body: 'Experience live, hands-on demonstrations of every Echelix solution in real time.' },
              { icon: '🔐', title: 'Secure Access', body: 'Enterprise-grade security with seamless Microsoft Teams integration for partners.' },
              { icon: '⚡', title: 'Instant Onboarding', body: 'Start exploring in seconds — just your email and company information.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-[#e2e0d3]">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[#5c6360]">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e0d3] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#7fac3d] flex items-center justify-center text-white font-bold text-xs">E</div>
            <span className="font-semibold text-sm">Echelix Demo Hub</span>
          </div>
          <p className="text-xs text-[#8a8f8c]">
            Modernize. Build Agentic Apps. Deliver Business Value.
          </p>
        </div>
      </footer>
    </div>
  );
}
