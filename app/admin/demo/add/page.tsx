'use client';

import { useState } from 'react';

export default function AddDemoPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demo_url: '',
    slug: '',
    roi_summary: '',
    audience: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAudienceChange = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      audience: prev.audience.includes(audience)
        ? prev.audience.filter(a => a !== audience)
        : [...prev.audience, audience]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/demos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }

      setMessage('Demo created successfully!');
      setFormData({
        title: '',
        description: '',
        demo_url: '',
        slug: '',
        roi_summary: '',
        audience: [],
      });
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Add New Demo</h1>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600"
              placeholder="Demo title"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 h-24"
              placeholder="Demo description"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Demo URL</label>
            <input
              type="url"
              name="demo_url"
              value={formData.demo_url}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600"
              placeholder="demo-slug"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">ROI Summary</label>
            <textarea
              name="roi_summary"
              value={formData.roi_summary}
              onChange={handleInputChange}
              className="w-full bg-slate-700 text-white rounded px-4 py-2 border border-slate-600 h-20"
              placeholder="ROI summary"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-4">Audience</label>
            <label className="flex items-center text-slate-300 mb-2">
              <input
                type="checkbox"
                checked={formData.audience.includes('customer')}
                onChange={() => handleAudienceChange('customer')}
                className="mr-2"
              />
              Customer
            </label>
            <label className="flex items-center text-slate-300">
              <input
                type="checkbox"
                checked={formData.audience.includes('microsoft')}
                onChange={() => handleAudienceChange('microsoft')}
                className="mr-2"
              />
              Microsoft
            </label>
          </div>

          {message && (
            <div className="p-4 rounded bg-blue-900 text-blue-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {loading ? 'Creating...' : 'Create Demo'}
          </button>
        </form>
      </div>
    </div>
  );
}