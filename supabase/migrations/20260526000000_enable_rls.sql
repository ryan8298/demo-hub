-- =============================================================================
--  Echelix Demo Hub — Row Level Security
--  =============================================================================
--  Goals:
--    • The anon key (shipped to the browser) can SELECT from `demos` so the
--      public hubs continue to work — but cannot INSERT/UPDATE/DELETE.
--    • The anon key has ZERO access to `visitor_sessions` — those rows are
--      written only by our server using the service role.
--    • The service-role key (server-only) retains full access. RLS does not
--      apply to the service role by design, but we keep explicit policies so
--      intent is documented in SQL.
--
--  Run this once in the Supabase SQL editor (or via `supabase db push` if you
--  set up the Supabase CLI). It is idempotent — safe to re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- demos table
-- -----------------------------------------------------------------------------
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

-- Drop pre-existing policies so re-runs converge on the policies below.
DROP POLICY IF EXISTS "anon can read demos"      ON public.demos;
DROP POLICY IF EXISTS "no anon writes on demos"  ON public.demos;

-- Public read access. The browser uses this via the anon key.
CREATE POLICY "anon can read demos"
  ON public.demos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policy is granted to anon. Without a matching
-- policy, the operation is denied. The service role bypasses RLS, so the
-- admin API (which uses supabaseAdmin) continues to work.

-- -----------------------------------------------------------------------------
-- visitor_sessions table
-- -----------------------------------------------------------------------------
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no anon access to visitor_sessions" ON public.visitor_sessions;

-- Intentionally empty: no policies for anon/authenticated. The only writer
-- is the server using the service-role key.
-- (Documented here so the intent is obvious to anyone reading the schema.)

-- -----------------------------------------------------------------------------
-- Helpful index for the audience filter pushed down from the API
-- -----------------------------------------------------------------------------
-- `audience` is a TEXT[] column. A GIN index makes the `audience @> ARRAY[..]`
-- predicate (used by /api/demos?audience=customer) efficient as the table grows.
CREATE INDEX IF NOT EXISTS idx_demos_audience_gin
  ON public.demos USING GIN (audience);
