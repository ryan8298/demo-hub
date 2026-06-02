-- =============================================================================
--  PDF download capture
--
--  Records who downloaded which PDF (industry one-pagers, etc.) so sales can
--  follow up and we can see which assets are most popular. Written exclusively
--  through the /api/pdf-download route using the service-role client, so RLS
--  is enabled with NO anon policies (the table holds contact PII).
--
--  Run via the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
--  Idempotent — safe to re-run.
-- =============================================================================

create table if not exists public.pdf_downloads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  email        text not null,
  name         text,
  company_name text,
  pdf_key      text not null,   -- stable identifier, e.g. "manufacturing"
  pdf_label    text,            -- human label, e.g. "Manufacturing"
  pdf_url      text,
  source_path  text,            -- where the download was triggered
  user_agent   text
);

-- Admin views: newest-first, group-by asset, look up by email.
create index if not exists pdf_downloads_created_at_idx on public.pdf_downloads (created_at desc);
create index if not exists pdf_downloads_pdf_key_idx    on public.pdf_downloads (pdf_key);
create index if not exists pdf_downloads_email_idx       on public.pdf_downloads (lower(email));

-- Lock down: service-role (our API + admin reads) bypasses RLS, so we define
-- zero policies — anon/public cannot read or write this table.
alter table public.pdf_downloads enable row level security;
drop policy if exists "anon can read pdf_downloads"   on public.pdf_downloads;
drop policy if exists "anon can insert pdf_downloads" on public.pdf_downloads;
