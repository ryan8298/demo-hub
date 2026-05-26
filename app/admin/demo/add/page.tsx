'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import {
  AudienceCard,
  BasicInfoCard,
  DemoFormValues,
  DemoLinkCard,
  DetailPageCard,
  IndustryCard,
  SubmitCard,
  TagsCard,
  Updater,
} from '@/components/admin/DemoFormCards';

const EMPTY_FORM: DemoFormValues = {
  title: '',
  description: '',
  demo_url: '',
  slug: '',
  roi_summary: '',
  industry: '',
  audience: [],
  tags: [],
  problem_statement: '',
  target_audience_description: '',
  architecture_diagram_url: '',
};

export default function AddDemoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DemoFormValues>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [previewImage, setPreviewImage] = useState('');
  const [fetchingPreview, setFetchingPreview] = useState(false);

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
      const response = await fetch('/api/demos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...formData,
          preview_image_url: previewImage || undefined,
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        router.push('/admin/login?next=/admin/demo/add');
        return;
      }
      if (!response.ok) {
        setMessageType('error');
        // Surface raw Supabase error detail so we can diagnose without
        // digging through Vercel logs.
        const detailStr = data.detail
          ? `\n\nDetail: ${JSON.stringify(data.detail)}`
          : '';
        setMessage(`${data.error || 'Failed to create demo'}${detailStr}`);
        return;
      }
      setMessageType('success');
      setMessage('✓ Demo published successfully');
      setFormData(EMPTY_FORM);
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
    <div className="min-h-screen bg-black text-milk">
      <AdminNav current="add" />

      {/* Header */}
      <header className="bg-wave relative pt-32 pb-16 border-b hairline">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sage mb-5">
            Admin Console
          </p>
          <h1 className="editorial font-serif text-[clamp(2rem,5vw,4rem)] text-milk leading-[1.05] mb-4 max-w-3xl">
            Publish a <em className="text-sea-foam not-italic">new</em> demo.
          </h1>
          <p className="text-base text-grey-300 max-w-xl">
            Add a new solution to the Echelix Demo Hub. Demos appear immediately
            on the audiences you select.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-8 py-12 md:py-16">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoCard values={formData} update={update} autoSlug />
            <DemoLinkCard
              values={formData}
              update={update}
              previewImage={previewImage}
              onFetchPreview={fetchPreviewImage}
              fetching={fetchingPreview}
              onPreviewChange={setPreviewImage}
            />
            <DetailPageCard values={formData} update={update} />
          </div>

          <div className="space-y-6">
            <IndustryCard value={formData.industry} update={update} />
            <AudienceCard value={formData.audience} update={update} />
            <TagsCard value={formData.tags} update={update} />
            <SubmitCard
              message={message}
              messageType={messageType}
              loading={loading}
              disabled={formData.audience.length === 0}
              submitLabel="Publish Demo →"
              loadingLabel="Publishing…"
              footnote="Live on selected hubs instantly"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
