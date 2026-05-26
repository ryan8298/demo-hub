import { createClient } from "@supabase/supabase-js";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY,
} from "@/lib/env";

/**
 * `supabase`       — anon client. Safe to use in browser code paths
 *                    (subject to RLS — see supabase/migrations).
 * `supabaseAdmin`  — service-role client. Server-only; bypasses RLS.
 *                    NEVER import this into a Client Component.
 *
 * The admin client uses the Supabase-recommended config for server-side
 * use: no session persistence, no auto-refresh, no realtime — these
 * defaults are aimed at browser usage and can interfere with the
 * service_role auth context on the server.
 */
export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
