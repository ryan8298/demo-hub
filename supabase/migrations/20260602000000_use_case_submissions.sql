-- =============================================================================
--  Use-case pilot submissions
--
--  Backs the public "Submit your idea" form (/pilot) that feeds the Embedded
--  Agent Pilot offering — visitors describe a workflow they'd like prototyped
--  for a chance at a free <1-week custom build.
--
--  Writes happen exclusively through our API route (/api/pilot/submit) using
--  the service-role client, which bypasses RLS. We therefore enable RLS with
--  NO anon policies — the anon/public key can neither read nor write this
--  table directly (it holds contact PII + competitive use-case detail).
--
--  Reads happen in the admin inbox (/admin/submissions), also via the
--  service-role client.
--
--  Run via the Supabase SQL editor (Dashboard → SQL Editor → New query).
--  Idempotent — safe to re-run.
-- =============================================================================

create table if not exists public.use_case_submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  -- Contact
  name            text not null,
  email           text not null,
  company_name    text,
  industry        text,
  -- The pitch
  use_case        text not null,   -- what they want demoed / prototyped
  current_pain    text,            -- the problem today
  desired_outcome text,            -- what success looks like
  -- Triage
  status          text not null default 'new'
                    check (status in ('new', 'reviewing', 'accepted', 'declined', 'archived')),
  admin_notes     text,
  -- Light provenance for abuse triage (no full request logging)
  source_path     text,
  user_agent      text
);

-- Admin inbox sorts newest-first and filters by status.
create index if not exists use_case_submissions_created_at_idx
  on public.use_case_submissions (created_at desc);
create index if not exists use_case_submissions_status_idx
  on public.use_case_submissions (status);

-- ---------------------------------------------------------------------------
--  RLS: lock the table down. Service-role (our API + admin reads) bypasses
--  RLS entirely, so we intentionally define ZERO policies — anon/public
--  cannot touch this table.
-- ---------------------------------------------------------------------------
alter table public.use_case_submissions enable row level security;

-- Defensive: drop any stray policies from a prior run so the table stays
-- closed to anon. (No-ops if they don't exist.)
drop policy if exists "anon can read use_case_submissions" on public.use_case_submissions;
drop policy if exists "anon can insert use_case_submissions" on public.use_case_submissions;
