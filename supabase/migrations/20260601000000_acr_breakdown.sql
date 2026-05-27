-- =============================================================================
--  ACR sizing rationale
--
--  Optional free-text field that explains how the Azure ACR figure shown
--  in the KPI strip was estimated — which services drive the spend, the
--  customer-scale assumptions, and what's excluded. Primarily for
--  Microsoft Partner tiles so reps can defend the number in co-sell
--  conversations, but exposed on every demo (just leave empty for
--  customer-facing tiles).
--
--  Renders as a small panel directly under the KPI strip on /demo/[slug]
--  when populated. Hidden entirely when null/empty.
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS acr_breakdown TEXT;
