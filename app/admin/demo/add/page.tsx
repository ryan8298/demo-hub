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
    } catch (error) {
      setMessageType('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
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
    } catch (error) {
      setMessage('⚠️ Could not auto-fetch preview (some sites block scraping)');
      setMessageType('error');
    } finally {
      setFetchingPreview(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0f0d' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#e0dfd5' }}>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
            Publish New Demo
          </h1>
          <p style={{ color: '#666666' }}>
            Add a new solution demo to your hub
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title & Slug Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Demo Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="e.g., Enterprise Security Dashboard"
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                style={{
                  background: '#f3f3e9',
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
              <p className="text-xs mt-2" style={{ color: '#999999' }}>
                This is the main title shown in the demo hub
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="auto-generated from title"
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                style={{
                  background: '#f3f3e9',
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
              <p className="text-xs mt-2" style={{ color: '#999999' }}>
                Unique identifier (auto-generated from title)
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              Description
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Demo Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief overview of what this demo showcases"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: '#f3f3e9',
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

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                ROI Summary
              </label>
              <textarea
                name="roi_summary"
                value={formData.roi_summary}
                onChange={handleInputChange}
                placeholder="e.g., Reduce operational costs by 30%, Improve efficiency by 40%"
                rows={2}
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: '#f3f3e9',
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
          </div>

          {/* Demo URL Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              Demo Link & Preview
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Demo URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  name="demo_url"
                  value={formData.demo_url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com/demo"
                  className="flex-1 px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                  style={{
                    background: '#f3f3e9',
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
                  type="button"
                  onClick={fetchPreviewImage}
                  disabled={fetchingPreview || !formData.demo_url}
                  className="px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  style={{
                    background: '#7fac3d',
                    color: '#f3f3e9',
                  }}
                  onMouseEnter={(e) => {
                    if (!fetchingPreview && formData.demo_url) {
                      e.currentTarget.style.background = '#6a9530';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#7fac3d';
                  }}
                >
                  {fetchingPreview ? 'Fetching...' : 'Auto-Fetch Image'}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: '#999999' }}>
                Full URL to the demo. Click "Auto-Fetch Image" to pull og:image from the site.
              </p>
            </div>

            {previewImage && (
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#b2eeda', background: '#f0f8ed' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: '#7fac3d' }}>
                  ✓ Preview Image Fetched
                </p>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-xs mt-2" style={{ color: '#999999' }}>
                  Image will be displayed in demo tiles
                </p>
              </div>
            )}
          </div>

          {/* Industry Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              Industry & Vertical
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>
                Industry/Vertical
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2"
                style={{
                  background: '#f3f3e9',
                  borderColor: '#e0dfd5',
                  color: '#1a1a1a',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7fac3d';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0dfd5';
                }}
              >
                <option value="">Select an industry...</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Audience Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
              Target Audience *
            </h2>

            <div className="space-y-3">
              {['customer', 'microsoft'].map((audience) => (
                <label
                  key={audience}
                  className="flex items-center p-4 rounded-lg cursor-pointer transition"
                  style={{
                    background: formData.audience.includes(audience) ? '#f0f8ed' : '#f3f3e9',
                    borderLeft: formData.audience.includes(audience) ? '4px solid #7fac3d' : '4px solid transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.audience.includes(audience)}
                    onChange={() => handleAudienceChange(audience)}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{
                      accentColor: '#7fac3d',
                    }}
                  />
                  <span className="ml-3 font-semibold" style={{ color: '#1a1a1a' }}>
                    {audience === 'customer' ? '👥 Customers' : '🔵 Microsoft Teams'}
                  </span>
                  <span className="ml-auto text-xs" style={{ color: '#999999' }}>
                    {audience === 'customer' ? 'For customer hub' : 'For Microsoft hub'}
                  </span>
                </label>
              ))}
            </div>

            {formData.audience.length === 0 && (
              <p className="text-sm" style={{ color: '#cd3232' }}>
                ⚠️ Select at least one audience
              </p>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div
              className="p-4 rounded-lg"
              style={{
                background: messageType === 'success' ? '#f0f8ed' : '#fde9e9',
                color: messageType === 'success' ? '#6a9530' : '#cd3232',
                borderLeft: `4px solid ${messageType === 'success' ? '#7fac3d' : '#cd3232'}`,
              }}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || formData.audience.length === 0}
              className="flex-1 py-3 px-6 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: formData.audience.length === 0 ? '#cccccc' : '#7fac3d',
                color: '#f3f3e9',
              }}
              onMouseEnter={(e) => {
                if (formData.audience.length > 0) {
                  e.currentTarget.style.background = '#6a9530';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.audience.length > 0) {
                  e.currentTarget.style.background = '#7fac3d';
                }
              }}
            >
              {loading ? 'Publishing...' : '✓ Publish Demo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
