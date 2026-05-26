'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EchelixLogo } from '@/components/HubShared';

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
  const router = useRouter();
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
    title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

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
        setMessage('⚠ No preview image found for this URL');
        setMessageType('error');
      }
    } catch {
      setMessage('⚠ Could not auto-fetch preview (some sites block scraping)');
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // ensures the admin session cookie is sent
        body: JSON.stringify({ ...formData, preview_image_url: previewImage || undefined }),
      });
      const data = await response.json();
      if (response.status === 401) {
        // Session expired or was revoked — bounce to login
        router.push('/admin/login?next=/admin/demo/add');
        return;
      }
      if (!response.ok) {
        setMessageType('error');
        setMessage(`Error: ${data.error || 'Failed to create demo'}`);
        return;
      }
      setMessageType('success');
      setMessage('✓ Demo published successfully');
      setFormData({ title: '', description: '', demo_url: '', slug: '', roi_summary: '', industry: '', audience: [] });
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
    <div className="min-h-screen bg-black text-[#F3F3E9]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-b hairline">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <EchelixLogo className="h-7 md:h-8 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <span className="badge">Admin</span>
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
                router.push('/admin/login');
                router.refresh();
              }}
              className="text-[10px] uppercase tracking-[0.25em] text-[#8B8586] hover:text-[#B2EEDA] transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-wave relative pt-32 pb-16 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7FAC9D] mb-5">
            Admin Console
          </p>
          <h1 className="editorial font-serif text-[clamp(2rem,5vw,4rem)] text-[#F3F3E9] leading-[1.05] mb-4 max-w-3xl">
            Publish a <em className="text-[#B2EEDA] not-italic">new</em> demo.
          </h1>
          <p className="text-base text-[#B2AEAF] max-w-xl">
            Add a new solution to the Echelix Demo Hub. Demos appear immediately on the audiences you select.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-[1400px] mx-auto px-8 py-16">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <section className="card p-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#7FAC9D] mb-1">01</p>
              <h2 className="font-serif text-2xl text-[#F3F3E9] mb-6">Basic Information</h2>

              <div className="space-y-5">
                <Field label="Demo Title *">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g., Enterprise Security Dashboard"
                    className="input-field"
                  />
                </Field>
                <Field label="URL Slug *" hint="Unique identifier (auto-generated from title).">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="auto-generated from title"
                    className="input-field"
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief overview of what this demo showcases"
                    rows={3}
                    className="input-field resize-none"
                  />
                </Field>
                <Field label="ROI Summary">
                  <textarea
                    name="roi_summary"
                    value={formData.roi_summary}
                    onChange={handleInputChange}
                    placeholder="e.g., Reduce operational costs by 30%, improve efficiency by 40%"
                    rows={2}
                    className="input-field resize-none"
                  />
                </Field>
              </div>
            </section>

            {/* Demo Link */}
            <section className="card p-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#7FAC9D] mb-1">02</p>
              <h2 className="font-serif text-2xl text-[#F3F3E9] mb-6">Demo Link & Preview</h2>

              <Field label="Demo URL *" hint='Full URL to the demo. Click "Auto-Fetch Image" to pull the og:image.'>
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
                    className="btn-ghost whitespace-nowrap"
                  >
                    {fetchingPreview ? 'Fetching…' : 'Auto-Fetch'}
                  </button>
                </div>
              </Field>

              {previewImage && (
                <div className="mt-4 p-4 rounded-lg border border-[#B2EEDA]/25 bg-[#B2EEDA]/5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#B2EEDA] mb-2">
                    ✓ Preview Image Fetched
                  </p>
                  <img src={previewImage} alt="Preview" className="w-full h-32 object-cover rounded" />
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <section className="card p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#7FAC9D] mb-1">03</p>
              <h2 className="font-serif text-xl text-[#F3F3E9] mb-4">Industry</h2>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select an industry…</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </section>

            <section className="card p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#7FAC9D] mb-1">04</p>
              <h2 className="font-serif text-xl text-[#F3F3E9] mb-4">Target Audience *</h2>
              <div className="space-y-2">
                {[
                  { key: 'customer', label: 'Customers', sub: 'For customer hub' },
                  { key: 'microsoft', label: 'Microsoft Teams', sub: 'For partner hub' },
                ].map((a) => {
                  const checked = formData.audience.includes(a.key);
                  return (
                    <label
                      key={a.key}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition border ${
                        checked
                          ? 'bg-[#B2EEDA]/8 border-[#B2EEDA]/40'
                          : 'bg-transparent border-[#F3F3E9]/10 hover:border-[#B2EEDA]/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleAudienceChange(a.key)}
                        className="w-4 h-4 cursor-pointer accent-[#B2EEDA]"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-sm text-[#F3F3E9]">{a.label}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#706A6B]">
                          {a.sub}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {formData.audience.length === 0 && (
                <p className="text-xs mt-3 text-[#CD3232]">⚠ Select at least one audience</p>
              )}
            </section>

            <section className="card p-6">
              {message && (
                <div
                  className={`p-3 rounded-lg text-xs mb-4 border ${
                    messageType === 'success'
                      ? 'bg-[#B2EEDA]/5 text-[#B2EEDA] border-[#B2EEDA]/30'
                      : 'bg-[#CD3232]/10 text-[#CD3232] border-[#CD3232]/30'
                  }`}
                >
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || formData.audience.length === 0}
                className="btn-pill w-full"
              >
                {loading ? 'Publishing…' : 'Publish Demo →'}
              </button>
              <p className="text-[10px] uppercase tracking-[0.2em] text-center mt-3 text-[#605A5B]">
                Live on selected hubs instantly
              </p>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-medium uppercase tracking-[0.25em] mb-2 text-[#B2AEAF]">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs mt-1.5 text-[#605A5B]">{hint}</p>}
    </div>
  );
}
