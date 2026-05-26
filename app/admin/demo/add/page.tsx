'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Finance & Banking',
  'Healthcare',
  'Retail & E-Commerce',
  'Manufacturing',
  'Technology',
  'Government',
  'Education',
  'Enterprise',
  'Other',
];

export default function AddDemoPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demo_url: '',
    slug: '',
    roi_summary: '',
    industry: '',
    audience: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [previewImage, setPreviewImage] = useState('');
  const [fetchingPreview, setFetchingPreview] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAudienceChange = (audience: string) => {
    setFormData((prev) => ({
      ...prev,
      audience: prev.audience.includes(audience)
        ? prev.audience.filter((a) => a !== audience)
        : [...prev.audience, audience],
    }));
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
  };

  const fetchPreviewImage = async () => {
    if (!formData.demo_url) {
      setMessage('Please enter a demo URL first');
      setMessageType('error');
      return;
    }
    setFetchingPreview(true);
    try {
      const response = await fetch('/api/demo/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo_url: formData.demo_url }),
      });
      if (!response.ok) throw new Error('Failed to fetch preview');
      const data = await response.json();
      if (data.image) {
        setPreviewImage(data.image);
        setMessage('✓ Preview image fetched successfully');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('⚠️ No preview image found for this URL');
        setMessageType('error');
      }
    } catch {
      setMessage('⚠️ Could not auto-fetch preview (some sites block scraping)');
      setMessageType('error');
    } finally {
      setFetchingPreview(false);
    }
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
        body: JSON.stringify({ ...formData, preview_image_url: previewImage || undefined }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessageType('error');
        setMessage(`Error: ${data.error || 'Failed to create demo'}`);
        return;
      }
      setMessageType('success');
      setMessage('✓ Demo published successfully!');
      setFormData({
        title: '',
        description: '',
        demo_url: '',
        slug: '',
        roi_summary: '',
        industry: '',
        audience: [],
      });
      setPreviewImage('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessageType('error');
      setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f3]">
      {/* Nav */}
      <nav className="border-b border-[#e2e0d3] bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-[#7fac3d] flex items-center justify-center text-white font-bold">E</div>
            <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">Echelix</span>
          </a>
          <span className="badge">Admin</span>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-grid border-b border-[#e2e0d3]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#1a1a1a]">
            Publish a new demo
          </h1>
          <p className="text-[#5c6360]">
            Add a new solution to the Echelix Demo Hub.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#e2e0d3]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5c6360] mb-5">
                Basic Information
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[#1a1a1a]">Demo Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g., Enterprise Security Dashboard"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[#1a1a1a]">URL Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="auto-generated from title"
                    className="input-field"
                  />
                  <p className="text-xs mt-1.5 text-[#8a8f8c]">
                    Unique identifier (auto-generated from title).
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[#1a1a1a]">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief overview of what this demo showcases"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-[#1a1a1a]">ROI Summary</label>
                  <textarea
                    name="roi_summary"
                    value={formData.roi_summary}
                    onChange={handleInputChange}
                    placeholder="e.g., Reduce operational costs by 30%, Improve efficiency by 40%"
                    rows={2}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Demo Link Card */}
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-[#e2e0d3]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5c6360] mb-5">
                Demo Link & Preview
              </h2>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-[#1a1a1a]">Demo URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="demo_url"
                    value={formData.demo_url}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com/demo"
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={fetchPreviewImage}
                    disabled={fetchingPreview || !formData.demo_url}
                    className="btn-secondary whitespace-nowrap text-sm"
                  >
                    {fetchingPreview ? 'Fetching…' : 'Auto-Fetch Image'}
                  </button>
                </div>
                <p className="text-xs mt-1.5 text-[#8a8f8c]">
                  Full URL to the demo. Click &quot;Auto-Fetch Image&quot; to pull the og:image from the site.
                </p>
              </div>

              {previewImage && (
                <div className="mt-4 p-4 rounded-lg border border-[#d6ebc4] bg-[#f0f8ed]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6a9530] mb-2">
                    ✓ Preview Image Fetched
                  </p>
                  <img src={previewImage} alt="Preview" className="w-full h-32 object-cover rounded" />
                </div>
              )}
            </section>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            {/* Industry */}
            <section className="bg-white rounded-2xl p-6 border border-[#e2e0d3]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5c6360] mb-4">
                Industry
              </h2>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select an industry…</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </section>

            {/* Audience */}
            <section className="bg-white rounded-2xl p-6 border border-[#e2e0d3]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5c6360] mb-4">
                Target Audience *
              </h2>
              <div className="space-y-2">
                {[
                  { key: 'customer', label: '👥 Customers', sub: 'For customer hub' },
                  { key: 'microsoft', label: '🔵 Microsoft Teams', sub: 'For partner hub' },
                ].map((a) => {
                  const checked = formData.audience.includes(a.key);
                  return (
                    <label
                      key={a.key}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition border ${
                        checked
                          ? 'bg-[#f0f8ed] border-[#7fac3d]'
                          : 'bg-[#faf9f3] border-[#e2e0d3] hover:border-[#7fac3d]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleAudienceChange(a.key)}
                        className="w-4 h-4 cursor-pointer accent-[#7fac3d]"
                      />
                      <div className="ml-3">
                        <div className="font-semibold text-sm text-[#1a1a1a]">{a.label}</div>
                        <div className="text-xs text-[#8a8f8c]">{a.sub}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {formData.audience.length === 0 && (
                <p className="text-xs mt-3 text-[#cd3232]">⚠️ Select at least one audience</p>
              )}
            </section>

            {/* Submit */}
            <section className="bg-white rounded-2xl p-6 border border-[#e2e0d3]">
              {message && (
                <div
                  className={`p-3 rounded-lg text-sm mb-4 border-l-4 ${
                    messageType === 'success'
                      ? 'bg-[#f0f8ed] text-[#6a9530] border-[#7fac3d]'
                      : 'bg-[#fde9e9] text-[#cd3232] border-[#cd3232]'
                  }`}
                >
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || formData.audience.length === 0}
                className="btn-primary w-full"
              >
                {loading ? 'Publishing…' : '✓ Publish Demo'}
              </button>
              <p className="text-xs text-center mt-3 text-[#8a8f8c]">
                Demos appear immediately on selected hubs.
              </p>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}
