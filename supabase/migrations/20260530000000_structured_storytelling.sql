-- =============================================================================
--  Structured Enterprise Storytelling Fields
--
--  Adds 8 JSONB columns to `demos` so the /demo/[slug] detail page can render
--  premium structured components (KPI strips, capability grids, agent
--  timelines, architecture flows, business outcome cards, telemetry stats)
--  instead of long-form paragraph blocks.
--
--  All default to empty arrays — existing demos continue to render via the
--  legacy fields (roi_summary, deployment_timeline, problem_statement, etc.)
--  until an admin fills the new ones in.
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS kpi_metrics        JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS challenge_points   JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS business_outcomes  JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS ai_capabilities    JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS tech_stack         JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS agent_timeline     JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS architecture_flow  JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS operational_stats  JSONB DEFAULT '[]';

-- Backfill nulls (rare — DEFAULT covers new rows but existing rows may
-- have been added before this migration if it's been partially applied).
UPDATE public.demos SET kpi_metrics       = '[]' WHERE kpi_metrics       IS NULL;
UPDATE public.demos SET challenge_points  = '[]' WHERE challenge_points  IS NULL;
UPDATE public.demos SET business_outcomes = '[]' WHERE business_outcomes IS NULL;
UPDATE public.demos SET ai_capabilities   = '[]' WHERE ai_capabilities   IS NULL;
UPDATE public.demos SET tech_stack        = '[]' WHERE tech_stack        IS NULL;
UPDATE public.demos SET agent_timeline    = '[]' WHERE agent_timeline    IS NULL;
UPDATE public.demos SET architecture_flow = '[]' WHERE architecture_flow IS NULL;
UPDATE public.demos SET operational_stats = '[]' WHERE operational_stats IS NULL;

ALTER TABLE public.demos ALTER COLUMN kpi_metrics       SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN challenge_points  SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN business_outcomes SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN ai_capabilities   SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN tech_stack        SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN agent_timeline    SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN architecture_flow SET NOT NULL;
ALTER TABLE public.demos ALTER COLUMN operational_stats SET NOT NULL;

-- Expected shapes (documented here, enforced in app code):
--
--   kpi_metrics:        [{ "label": "Anomalies/min", "value": "247" }, ...]
--   challenge_points:   ["Pain point one", "Pain point two", ...]
--   business_outcomes:  [{ "label": "MTTR reduction", "value": "82%",
--                          "description": "Optional context" }, ...]
--   ai_capabilities:    [{ "label": "Predictive failure detection",
--                          "description": "Optional details" }, ...]
--   tech_stack:         ["Azure Fabric RTI", "Microsoft 365", ...]
--   agent_timeline:     [{ "timestamp": "09:24",
--                          "event": "Anomaly detected at WB-108",
--                          "status": "alert" }, ...]
--                        status ∈ { "pending" | "in_progress" | "completed" | "alert" }
--   architecture_flow:  [{ "step": "Ingest",
--                          "description": "Optional details" }, ...]
--   operational_stats:  [{ "label": "Active Agents", "value": "4" }, ...]
