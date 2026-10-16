import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Database client with the secret service-role key. It bypasses RLS (the
 * `instruments` table has no public policies), so it must only ever run on
 * the server — the "server-only" import makes a client-side import a build
 * error. Every query that should be limited to published fichas filters on
 * `status = 'approved'` explicitly in instruments-repository.ts.
 */
export function createServiceClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
