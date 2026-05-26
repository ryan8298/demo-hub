-- =============================================================================
--  Demo Assets Storage Bucket
--
--  Public-read bucket for admin-uploaded images:
--    • Demo preview screenshots (when og:image scraping fails)
--    • Architecture diagrams shown on /demo/[slug] detail pages
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

-- Create the bucket if it doesn't exist. `public = true` means objects in
-- the bucket are served via public URLs — what we want for preview images.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'demo-assets',
  'demo-assets',
  true,
  5242880,  -- 5 MB per file
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Policies on storage.objects for THIS bucket only.
-- Reads: anyone (anon, authenticated). Writes: only service_role (our
-- admin API uses supabaseAdmin which bypasses RLS, so this implicitly
-- denies browser-side uploads).
DROP POLICY IF EXISTS "demo_assets_public_read" ON storage.objects;
CREATE POLICY "demo_assets_public_read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'demo-assets');
