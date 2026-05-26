-- =============================================================================
--  One-pager fields for /demo/[slug] detail pages
--
--    • problem_statement              — "What is it solving"
--    • target_audience_description    — "Who is it for" (free-form text,
--                                       distinct from the `audience` array
--                                       which gates hub routing)
--    • architecture_diagram_url       — Uploaded image URL of the high-level
--                                       Microsoft-based solution architecture
--
--  Run in the Supabase SQL editor. Idempotent.
-- =============================================================================

ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS problem_statement              TEXT,
  ADD COLUMN IF NOT EXISTS target_audience_description    TEXT,
  ADD COLUMN IF NOT EXISTS architecture_diagram_url       TEXT;
