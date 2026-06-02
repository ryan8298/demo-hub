'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SUBMISSION_STATUSES,
  type UseCaseSubmission,
  type SubmissionStatus,
} from '@/lib/submissions';

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  new: 'bg-sea-foam text-black border-sea-foam',
  reviewing: 'bg-sage/20 text-sage border-sage/40',
  accepted: 'bg-sage text-black border-sage',
  declined: 'bg-error/15 text-error border-error/30',
  archived: 'bg-milk/5 text-grey-400 border-milk/15',
};

export function SubmissionCard({ submission }: { submission: UseCaseSubmission }) {
  const router = useRouter();
  const [status, setStatus] = useState<SubmissionStatus>(submission.status);
  const [notes, setNotes] = useState(submission.admin_notes ?? '');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function patch(payload: { status?: SubmissionStatus; admin_notes?: string }) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Save failed');
        return;
      }
      setSavedAt(new Date().toLocaleTimeString());
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  function onStatusChange(next: SubmissionStatus) {
    setStatus(next);
    patch({ status: next });
  }

  const created = new Date(submission.created_at).toLocaleString();

  return (
    <article className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-serif text-xl text-milk leading-tight">
            {submission.company_name || submission.name}
          </h3>
          <p className="text-xs text-grey-400 mt-1">
            {submission.name} ·{' '}
            <a href={`mailto:${submission.email}`} className="text-sea-foam hover:underline">
              {submission.email}
            </a>
            {submission.industry && <> · {submission.industry}</>}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-grey-600 mt-1">
            {created}
          </p>
        </div>
        <span
          className={`text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border whitespace-nowrap ${STATUS_STYLE[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-3 mb-5">
        <Block label="Use case" value={submission.use_case} />
        {submission.current_pain && <Block label="Current pain" value={submission.current_pain} />}
        {submission.desired_outcome && <Block label="Desired outcome" value={submission.desired_outcome} />}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-1.5 block">
            Status
          </span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as SubmissionStatus)}
            disabled={saving}
            className="input-field !py-2 text-sm"
          >
            {SUBMISSION_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="block flex-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-grey-500 mb-1.5 block">
            Notes (internal)
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Triage notes…"
              className="input-field !py-2 text-sm flex-1"
            />
            <button
              type="button"
              onClick={() => patch({ admin_notes: notes })}
              disabled={saving}
              className="btn-ghost text-xs whitespace-nowrap"
            >
              Save
            </button>
          </div>
        </label>
      </div>

      {error && <p className="text-xs text-error mt-2">{error}</p>}
      {savedAt && !error && <p className="text-[10px] text-grey-600 mt-2">Saved {savedAt}</p>}
    </article>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-sage mb-1">{label}</p>
      <p className="text-sm text-grey-200 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}
