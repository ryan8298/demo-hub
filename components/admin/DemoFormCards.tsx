'use client';

/**
 * Form sub-components for the admin "Publish Demo" and "Edit Demo" pages.
 *
 * Form state lives in the parent — each card receives just the values it
 * needs plus a single `update` function that merges a partial back into
 * the parent's state. This keeps the card components stateless and
 * trivially reusable between the add and edit flows.
 */

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
}: {
  values: DemoFormValues;
  update: Updater;
  previewImage: string;
  onFetchPreview: () => void;
  fetching: boolean;
}) {
  return (
    <section className="card p-8">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sage mb-1">02</p>
      <h2 className="font-serif text-2xl text-milk mb-6">Demo Link & Preview</h2>

      <Field
        label="Demo URL *"
        hint='Full URL to the demo. Click "Auto-Fetch" to pull the og:image from the site.'
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

      {previewImage && (
        <div className="mt-4 p-4 rounded-lg border border-sea-foam/25 bg-sea-foam/5">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-sea-foam mb-2">
            ✓ Preview Image Fetched
          </p>
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
   05 — Submit card with status banner
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
          className={`p-3 rounded-lg text-xs mb-4 border ${
            messageType === 'success'
              ? 'bg-sea-foam/5 text-sea-foam border-sea-foam/30'
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
