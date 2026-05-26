-- =============================================================================
--  D-Tier Features
--    • D7  tags / collections     — TEXT[] column for free-form labels
--    • D2  click tracking         — view_count + click_count counters
--                                   with an atomic increment function
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

-- D7: tags ---------------------------------------------------------------------
ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

-- GIN index for fast `tags @> ARRAY['foo']` filter pushdown from the API.
CREATE INDEX IF NOT EXISTS idx_demos_tags_gin
  ON public.demos USING GIN (tags);

-- D2: counters -----------------------------------------------------------------
ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS view_count  INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS click_count INTEGER NOT NULL DEFAULT 0;

-- Atomic increment via a Postgres function. Avoids read-modify-write races
-- when many users hit the same demo simultaneously.
CREATE OR REPLACE FUNCTION public.increment_demo_metric(
  p_id     UUID,
  p_metric TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_metric = 'view' THEN
    UPDATE public.demos SET view_count = view_count + 1 WHERE id = p_id;
  ELSIF p_metric = 'click' THEN
    UPDATE public.demos SET click_count = click_count + 1 WHERE id = p_id;
  ELSE
    RAISE EXCEPTION 'invalid metric %', p_metric;
  END IF;
END;
$$;

-- Allow the anon role to call this RPC. RLS still applies to the underlying
-- UPDATE, but with SECURITY DEFINER the function executes with elevated
-- privileges — safe because the function only increments two numeric
-- columns and rejects any metric name other than 'view' or 'click'.
GRANT EXECUTE ON FUNCTION public.increment_demo_metric(UUID, TEXT) TO anon, authenticated;
