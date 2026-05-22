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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Demo Hub</h1>
          <p className="text-slate-400">Explore our solutions in action</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            required
            className="w-full px-4 py-2 bg-slate-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Access Demos'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          {formData.email.toLowerCase().endsWith('@microsoft.com') && (
            <span className="text-blue-400">✓ Microsoft access detected</span>
          )}
        </p>
      </div>
    </div>
  );
}