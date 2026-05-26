'use client';

/**
 * Form sub-components for the admin "Publish Demo" and "Edit Demo" pages.
 *
 * Form state lives in the parent — each card receives just the values it
 * needs plus a single `update` function that merges a partial back into
 * the parent's state. This keeps the card components stateless and
 * trivially reusable between the add and edit flows.
 */

import { useState } from 'react';
import Image from 'next/image';

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

export type DemoFormValues = {
  title: string;
  description: string;
  demo_url: string;
  slug: string;
  roi_summary: string;
  industry: string;
  audience: string[];
  tags: string[];
  // One-pager content for /demo/[slug]
  problem_statement: string;
  target_audience_description: string;
  architecture_diagram_url: string;
};

export type Updater = (next: Partial<DemoFormValues>) => void;

/* ============================================================
   Field — labelled input wrapper used by every card
   ============================================================ */
export function Field({
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
      <label className="block text-[10px] font-medium uppercase tracking-[0.25em] mb-2 text-grey-300">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs mt-1.5 text-grey-600">{hint}</p>}
    </div>
  );
}

/* ============================================================
   01 — Basic information
   ============================================================ */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function BasicInfoCard({
  values,
  update,
  autoSlug = true,
}: {
  values: DemoFormValues;
  update: Updater;
  /** Auto-derive slug from title (set false on the edit form to leave existing slugs alone). */
  autoSlug?: boolean;
}) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    update(autoSlug ? { title, slug: generateSlug(title) } : { title });
  };

  return (
    <section className="card p-8">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">01</p>
      <h2 className="font-serif text-2xl text-milk mb-6">Basic Information</h2>

      <div className="space-y-5">
        <Field label="Demo Title *">
          <input
            type="text"
            value={values.title}
            onChange={handleTitleChange}
            required
            placeholder="e.g., Enterprise Security Dashboard"
            className="input-field"
          />
        </Field>
        <Field
          label="URL Slug *"
          hint={
            autoSlug
              ? 'Unique identifier (auto-generated from title).'
              : 'Unique identifier. Change with care — existing links break.'
          }
        >
          <input
            type="text"
            value={values.slug}
            onChange={(e) => update({ slug: e.target.value })}
            required
            placeholder="auto-generated from title"
            className="input-field"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={values.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Brief overview of what this demo showcases"
            rows={3}
            className="input-field resize-none"
          />
        </Field>
        <Field label="ROI Summary">
          <textarea
            value={values.roi_summary}
            onChange={(e) => update({ roi_summary: e.target.value })}
            placeholder="e.g., Reduce operational costs by 30%, improve efficiency by 40%"
            rows={2}
            className="input-field resize-none"
          />
        </Field>
      </div>
    </section>
  );
}

/* ============================================================
   02 — Demo link + preview image
   ============================================================ */
export function DemoLinkCard({
  values,
  update,
  previewImage,
  onFetchPreview,
  fetching,
  onPreviewChange,
}: {
  values: DemoFormValues;
  update: Updater;
  previewImage: string;
  onFetchPreview: () => void;
  fetching: boolean;
  /** Called after a manual file upload succeeds. Receives the public URL. */
  onPreviewChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'previews');
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        const detailStr = data.detail
          ? ` (${JSON.stringify(data.detail)})`
          : '';
        setUploadError((data.error || 'Upload failed.') + detailStr);
        return;
      }
      onPreviewChange(data.url);
    } catch {
      setUploadError('Network error during upload.');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  }

  return (
    <section className="card p-8">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">02</p>
      <h2 className="font-serif text-2xl text-milk mb-6">Demo Link & Preview</h2>

      <Field
        label="Demo URL *"
        hint='Full URL to the demo. Click "Auto-Fetch" to try pulling the site’s og:image — or upload a custom screenshot below.'
      >
        <div className="flex gap-2">
          <input
            type="url"
            value={values.demo_url}
            onChange={(e) => update({ demo_url: e.target.value })}
            required
            placeholder="https://example.com/demo"
            className="input-field"
          />
          <button
            type="button"
            onClick={onFetchPreview}
            disabled={fetching || !values.demo_url}
            className="btn-ghost whitespace-nowrap"
          >
            {fetching ? 'Fetching…' : 'Auto-Fetch'}
          </button>
        </div>
      </Field>

      {/* Manual upload — fallback for demos that block scraping */}
      <div className="mt-5">
        <Field
          label="Or upload a preview image"
          hint="PNG, JPG, WebP, GIF, or SVG. Max 5 MB. Use this when Auto-Fetch returns nothing."
        >
          <label className="block">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-grey-300
                         file:mr-3 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-xs file:uppercase file:tracking-[0.15em]
                         file:font-medium
                         file:bg-sea-foam file:text-black
                         hover:file:bg-sea-foam/90
                         file:cursor-pointer cursor-pointer
                         disabled:opacity-50"
            />
          </label>
        </Field>
        {uploading && (
          <p className="text-xs text-grey-400 mt-2">Uploading…</p>
        )}
        {uploadError && (
          <p className="text-xs text-error mt-2" role="alert">
            {uploadError}
          </p>
        )}
      </div>

      {previewImage && (
        <div className="mt-5 p-4 rounded-lg border border-sea-foam/25 bg-sea-foam/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-sea-foam">
              ✓ Current preview image
            </p>
            <button
              type="button"
              onClick={() => onPreviewChange('')}
              className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-error transition"
            >
              Remove
            </button>
          </div>
          <div className="relative w-full h-32 rounded overflow-hidden">
            <Image
              src={previewImage}
              alt="Preview"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized={previewImage.startsWith('http')}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   03 — Industry / vertical
   ============================================================ */
export function IndustryCard({
  value,
  update,
}: {
  value: string;
  update: Updater;
}) {
  return (
    <section className="card p-6">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">03</p>
      <h2 className="font-serif text-xl text-milk mb-4">Industry</h2>
      <select
        value={value}
        onChange={(e) => update({ industry: e.target.value })}
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
  );
}

/* ============================================================
   04 — Target audience
   ============================================================ */
const AUDIENCES = [
  { key: 'customer', label: 'Customers', sub: 'For customer hub' },
  { key: 'microsoft', label: 'Microsoft Teams', sub: 'For partner hub' },
];

export function AudienceCard({
  value,
  update,
}: {
  value: string[];
  update: Updater;
}) {
  const toggle = (audience: string) =>
    update({
      audience: value.includes(audience)
        ? value.filter((a) => a !== audience)
        : [...value, audience],
    });

  return (
    <section className="card p-6">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">04</p>
      <h2 className="font-serif text-xl text-milk mb-4">Target Audience *</h2>
      <div className="space-y-2">
        {AUDIENCES.map((a) => {
          const checked = value.includes(a.key);
          return (
            <label
              key={a.key}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition border ${
                checked
                  ? 'bg-sea-foam/8 border-sea-foam/40'
                  : 'bg-transparent border-milk/10 hover:border-sea-foam/40'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(a.key)}
                className="w-4 h-4 cursor-pointer accent-sea-foam"
              />
              <div className="ml-3">
                <div className="font-medium text-sm text-milk">{a.label}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-grey-500">
                  {a.sub}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="text-xs mt-3 text-error">⚠ Select at least one audience</p>
      )}
    </section>
  );
}

/* ============================================================
   05 — Tags / collections (free-form labels for cross-cutting groups)
   ============================================================ */
const SUGGESTED_TAGS = [
  'AI-first',
  'Azure',
  'Microsoft 365',
  'Cost reduction',
  'Customer experience',
  'Compliance',
  'Automation',
  'Data & Analytics',
  'Security',
];

export function TagsCard({
  value,
  update,
}: {
  value: string[];
  update: Updater;
}) {
  const [draft, setDraft] = useState('');

  function addTag(tag: string) {
    const clean = tag.trim();
    if (!clean) return;
    if (value.includes(clean)) return;
    update({ tags: [...value, clean] });
    setDraft('');
  }

  function removeTag(tag: string) {
    update({ tags: value.filter((t) => t !== tag) });
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      // Quick remove of last tag when input is empty
      removeTag(value[value.length - 1]);
    }
  }

  const unusedSuggestions = SUGGESTED_TAGS.filter((s) => !value.includes(s));

  return (
    <section className="card p-6">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">05</p>
      <h2 className="font-serif text-xl text-milk mb-4">Tags</h2>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="badge badge-sage hover:bg-error/15 hover:text-error hover:border-error/30 transition"
              title="Click to remove"
            >
              {tag} ✕
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => addTag(draft)}
        placeholder="Add a tag and press Enter…"
        className="input-field text-sm"
      />

      {unusedSuggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-2">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unusedSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="text-[10px] uppercase tracking-[0.15em] font-medium px-2.5 py-1 rounded-full border border-milk/15 text-grey-300 hover:border-sea-foam hover:text-sea-foam transition"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   06 — Detail-page one-pager content
   Renders on /demo/[slug] as the "what / who / what it solves /
   architecture" sections.
   ============================================================ */
export function DetailPageCard({
  values,
  update,
}: {
  values: DemoFormValues;
  update: Updater;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleArchUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'architecture');
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        credentials: 'same-origin',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        const detailStr = data.detail
          ? ` (${JSON.stringify(data.detail)})`
          : '';
        setUploadError((data.error || 'Upload failed.') + detailStr);
        return;
      }
      update({ architecture_diagram_url: data.url });
    } catch {
      setUploadError('Network error during upload.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <section className="card p-8">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">06</p>
      <h2 className="font-serif text-2xl text-milk mb-1">Detail Page Content</h2>
      <p className="text-xs text-grey-500 mb-6">
        Shown on the public <span className="font-mono">/demo/[slug]</span> page. All optional —
        sections without content are hidden automatically.
      </p>

      <div className="space-y-5">
        <Field
          label="Who it's for"
          hint="Plain-English description of the target audience (e.g., 'Mid-market manufacturers running on Azure'). Distinct from the audience checkboxes above, which only control hub routing."
        >
          <textarea
            value={values.target_audience_description}
            onChange={(e) => update({ target_audience_description: e.target.value })}
            placeholder="e.g., CIOs and IT leaders at financial services firms with 500+ employees"
            rows={2}
            className="input-field resize-none"
          />
        </Field>

        <Field
          label="What it solves"
          hint="The problem statement — the pain point this demo addresses."
        >
          <textarea
            value={values.problem_statement}
            onChange={(e) => update({ problem_statement: e.target.value })}
            placeholder="e.g., Manual compliance reporting consuming 40+ hours per week per analyst"
            rows={4}
            className="input-field resize-none"
          />
        </Field>

        <Field
          label="Architecture Diagram"
          hint="High-level Microsoft-based solution architecture. PNG, JPG, WebP, SVG, or PDF — max 10 MB."
        >
          <label className="block">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf,.pdf"
              onChange={handleArchUpload}
              disabled={uploading}
              className="block w-full text-sm text-grey-300
                         file:mr-3 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-xs file:uppercase file:tracking-[0.15em]
                         file:font-medium
                         file:bg-sea-foam file:text-black
                         hover:file:bg-sea-foam/90
                         file:cursor-pointer cursor-pointer
                         disabled:opacity-50"
            />
          </label>
          {uploading && <p className="text-xs text-grey-400 mt-2">Uploading…</p>}
          {uploadError && (
            <p className="text-xs text-error mt-2 break-words" role="alert">
              {uploadError}
            </p>
          )}
        </Field>

        {values.architecture_diagram_url && (
          <ArchitecturePreview
            url={values.architecture_diagram_url}
            onRemove={() => update({ architecture_diagram_url: '' })}
          />
        )}
      </div>
    </section>
  );
}

/**
 * Preview tile for an uploaded architecture diagram. Renders an image
 * via next/image OR a PDF badge with download link — based on the URL
 * extension / content type.
 */
function ArchitecturePreview({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) {
  const isPdf = /\.pdf(\?|$)/i.test(url);
  return (
    <div className="p-4 rounded-lg border border-sea-foam/25 bg-sea-foam/5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-sea-foam">
          ✓ Architecture diagram uploaded {isPdf && '(PDF)'}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] uppercase tracking-[0.2em] text-grey-400 hover:text-error transition"
        >
          Remove
        </button>
      </div>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded bg-black/40 hover:bg-black/60 transition"
        >
          <div className="w-10 h-12 rounded bg-error/20 border border-error/40 flex items-center justify-center text-error text-[10px] font-bold">
            PDF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-milk truncate">{url.split('/').pop()}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mt-1">
              Click to open in a new tab
            </p>
          </div>
        </a>
      ) : (
        <div className="relative w-full h-48 rounded overflow-hidden bg-black/40">
          <Image
            src={url}
            alt="Architecture diagram"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            unoptimized={url.startsWith('http')}
          />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   07 — Submit card with status banner
   ============================================================ */
export function SubmitCard({
  message,
  messageType,
  loading,
  disabled,
  submitLabel,
  loadingLabel = 'Saving…',
  footnote,
}: {
  message: string;
  messageType: 'success' | 'error';
  loading: boolean;
  disabled: boolean;
  submitLabel: string;
  loadingLabel?: string;
  footnote?: string;
}) {
  return (
    <section className="card p-6">
      {message && (
        <div
          role={messageType === 'error' ? 'alert' : 'status'}
          className={`p-3 rounded-lg text-xs mb-4 border whitespace-pre-wrap break-words font-mono ${
            messageType === 'success'
              ? 'bg-sea-foam/5 text-sea-foam border-sea-foam/30 font-sans'
              : 'bg-error/10 text-error border-error/30'
          }`}
        >
          {message}
        </div>
      )}
      <button type="submit" disabled={loading || disabled} className="btn-pill w-full">
        {loading ? loadingLabel : submitLabel}
      </button>
      {footnote && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-center mt-3 text-grey-600">
          {footnote}
        </p>
      )}
    </section>
  );
}
