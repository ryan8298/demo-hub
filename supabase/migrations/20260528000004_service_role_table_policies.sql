-- =============================================================================
--  Explicit service_role policies on the demos + visitor_sessions tables.
--
--  Same belt-and-suspenders fix as the storage policies migration. service_role
--  should bypass RLS in theory, but on some Supabase installs (or with certain
--  client configurations) RLS still applies. Symptoms when it doesn't bypass:
--
--    • POST /api/demos       — insert succeeds but downstream code can't
--                              SELECT the result
--    • PUT /api/demo/[id]    — "Cannot coerce the result to a single JSON
--                              object" because UPDATE ... RETURNING * comes
--                              back filtered to 0 rows
--    • DELETE /api/demo/[id] — silently no-ops
--
--  Granting FOR ALL to service_role explicitly closes this gap.
--
--  Security: service_role is only ever used in server-side code paths
--  (lib/supabase.ts -> supabaseAdmin). The key is in Vercel env vars,
--  never in the client bundle. Granting FOR ALL is equivalent to the
--  bypass that's supposed to be automatic.
--
--  Run in the Supabase SQL editor. Idempotent.
-- =============================================================================

-- demos -----------------------------------------------------------------------
DROP POLICY IF EXISTS "demos_service_role_all" ON public.demos;
CREATE POLICY "demos_service_role_all"
  ON public.demos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- visitor_sessions ------------------------------------------------------------
DROP POLICY IF EXISTS "visitor_sessions_service_role_all" ON public.visitor_sessions;
CREATE POLICY "visitor_sessions_service_role_all"
  ON public.visitor_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
