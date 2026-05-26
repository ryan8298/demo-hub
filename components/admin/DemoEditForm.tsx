'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Demo } from '@/lib/types';
import {
  AudienceCard,
  BasicInfoCard,
  DemoFormValues,
  DemoLinkCard,
  IndustryCard,
  SubmitCard,
  Updater,
} from '@/components/admin/DemoFormCards';

function valuesFromDemo(demo: Demo): DemoFormValues {
  return {
    title: demo.title || '',
    description: demo.description || '',
    demo_url: demo.demo_url || '',
    slug: demo.slug || '',
    roi_summary: demo.roi_summary || '',
    industry: demo.industry || '',
    audience: demo.audience || [],
  };
}

export function DemoEditForm({ demo }: { demo: Demo }) {
  const router = useRouter();
  const [formData, setFormData] = useState<DemoFormValues>(valuesFromDemo(demo));
  const [previewImage, setPreviewImage] = useState(demo.preview_image_url || '');
  const [fetchingPreview, setFetchingPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const update: Updater = (next) =>
    setFormData((prev) => ({ ...prev, ...next }));

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
      const response = await fetch(`/api/demo/${demo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...formData,
          preview_image_url: previewImage || null,
        }),
      });
      if (response.status === 401) {
        router.push(`/admin/login?next=/admin/demo/${demo.id}/edit`);
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessageType('error');
        setMessage(`Error: ${data.error || 'Failed to update demo'}`);
        return;
      }
      setMessageType('success');
      setMessage('✓ Demo updated. Redirecting…');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 800);
    } catch (err) {
      setMessageType('error');
      setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* autoSlug=false: editing an existing demo shouldn't rewrite the
            slug from the title — existing links would break. */}
        <BasicInfoCard values={formData} update={update} autoSlug={false} />
        <DemoLinkCard
          values={formData}
          update={update}
          previewImage={previewImage}
          onFetchPreview={fetchPreviewImage}
          fetching={fetchingPreview}
        />
      </div>

      <div className="space-y-6">
        <IndustryCard value={formData.industry} update={update} />
        <AudienceCard value={formData.audience} update={update} />
        <SubmitCard
          message={message}
          messageType={messageType}
          loading={loading}
          disabled={formData.audience.length === 0}
          submitLabel="Save changes →"
          loadingLabel="Saving…"
          footnote="Updates go live on selected hubs immediately"
        />
      </div>
    </form>
  );
}
