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

      const data = await response.json();
      const isMicrosoft = formData.email.toLowerCase().endsWith('@microsoft.com');

      router.push(isMicrosoft ? '/microsoft/hub' : '/customer/hub');
    } catch (err) {
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
    <div className="min-h-screen" style={{ background: '#0a0f0d' }}>
      {/* Header Navigation */}
      <div className="border-b" style={{ borderColor: '#e0dfd5' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
            Echelix
          </div>
          <div style={{ color: '#7fac3d' }} className="text-sm font-semibold">
            Demo Hub
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b" style={{ borderColor: '#e0dfd5' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
                Experience Our Solutions
              </h1>
              <p className="text-xl mb-8" style={{ color: '#666666' }}>
                Explore interactive demonstrations of how Echelix solutions can transform your organization
              </p>
              <div className="flex gap-3">
                <span
                  className="text-sm font-semibold px-4 py-2 rounded-full"
                  style={{
                    background: '#e8f5e0',
                    color: '#7fac3d',
                  }}
                >
                  🚀 Live Demos
                </span>
                <span
                  className="text-sm font-semibold px-4 py-2 rounded-full"
                  style={{
                    background: '#e8f5e0',
                    color: '#7fac3d',
                  }}
                >
                  💼 Enterprise Ready
                </span>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <div
                className="rounded-lg p-8"
                style={{
                  background: '#f3f3e9',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
                  Access Demos
                </h2>
                <p className="mb-6" style={{ color: '#666666' }}>
                  Enter your information to explore our solutions
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div
                      className="p-4 rounded-lg text-sm"
                      style={{
                        background: '#fde9e9',
                        color: '#cd3232',
                        borderLeft: '4px solid #cd3232',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                      style={{
                        background: '#ffffff',
                        borderColor: '#e0dfd5',
                        color: '#1a1a1a',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7fac3d';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0dfd5';
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                      style={{
                        background: '#ffffff',
                        borderColor: '#e0dfd5',
                        color: '#1a1a1a',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7fac3d';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0dfd5';
                      }}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Work Email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                    style={{
                      background: '#ffffff',
                      borderColor: isMicrosoftEmail ? '#7fac3d' : '#e0dfd5',
                      color: '#1a1a1a',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7fac3d';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isMicrosoftEmail ? '#7fac3d' : '#e0dfd5';
                    }}
                  />

                  {isMicrosoftEmail && (
                    <div
                      className="p-3 rounded-lg text-sm flex items-center gap-2"
                      style={{
                        background: '#f0f8ed',
                        color: '#7fac3d',
                      }}
                    >
                      ✓ Microsoft access detected
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                    style={{
                      background: '#ffffff',
                      borderColor: '#e0dfd5',
                      color: '#1a1a1a',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#7fac3d';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0dfd5';
                    }}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: '#7fac3d',
                      color: '#f3f3e9',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#6a9530';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#7fac3d';
                    }}
                  >
                    {loading ? 'Signing up...' : 'Explore Demos →'}
                  </button>
                </form>

                <p
                  className="text-center text-xs mt-4"
                  style={{ color: '#999999' }}
                >
                  By accessing demos, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
              Interactive Demos
            </h3>
            <p style={{ color: '#666666' }}>
              Experience live, hands-on demonstrations of our solutions in real time
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
              Secure Access
            </h3>
            <p style={{ color: '#666666' }}>
              Enterprise-grade security with Microsoft Teams integration for authorized users
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
              Quick Onboarding
            </h3>
            <p style={{ color: '#666666' }}>
              Start exploring in seconds with just your email and company information
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t" style={{ borderColor: '#e0dfd5' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p style={{ color: '#999999' }} className="text-sm">
            Echelix Demo Hub • Modernize. Build Agentic Apps. Deliver Business Value.
          </p>
        </div>
      </div>
    </div>
  );
}
