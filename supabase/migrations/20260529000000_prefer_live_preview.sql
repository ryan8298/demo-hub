-- =============================================================================
--  Per-demo "use live iframe preview" toggle.
--
--  When TRUE, /customer/hub and /microsoft/hub render the demo card's
--  preview area as a scaled iframe of `demo_url` instead of the static
--  `preview_image_url`. Only works for sites that allow being framed
--  (Lovable previews, Vercel apps with permissive frame-ancestors, etc.).
--
--  Default FALSE — the safe choice. Most demo URLs block framing, so
--  the og:image / uploaded image is the reliable rendering path.
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS prefer_live_preview BOOLEAN DEFAULT FALSE;
UPDATE public.demos SET prefer_live_preview = FALSE WHERE prefer_live_preview IS NULL;
ALTER TABLE public.demos ALTER COLUMN prefer_live_preview SET NOT NULL;
