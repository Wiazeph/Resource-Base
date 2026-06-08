import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — full DB access, bypasses RLS. ONLY for server
 * code (route handlers): notification inserts, submission mirror writes.
 * NEVER import into a Client Component.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
