-- =============================================================================
--  Explicit write policies for the demo-assets storage bucket.
--
--  In theory the service_role bypasses RLS. In practice, some Supabase
--  installations enforce RLS on storage.objects even for service_role
--  unless explicit policies exist. This migration adds belt-and-suspenders
--  policies so admin uploads work regardless.
--
--  Security note: these policies are scoped to bucket_id = 'demo-assets'
--  and granted only to the service_role. Anon and authenticated users
--  still cannot write to this bucket — uploads must go through our
--  /api/admin/upload-image route, which is gated by the admin cookie.
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

DROP POLICY IF EXISTS "demo_assets_service_role_insert" ON storage.objects;
CREATE POLICY "demo_assets_service_role_insert"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'demo-assets');

DROP POLICY IF EXISTS "demo_assets_service_role_update" ON storage.objects;
CREATE POLICY "demo_assets_service_role_update"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'demo-assets')
  WITH CHECK (bucket_id = 'demo-assets');

DROP POLICY IF EXISTS "demo_assets_service_role_delete" ON storage.objects;
CREATE POLICY "demo_assets_service_role_delete"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'demo-assets');
