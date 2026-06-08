import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free anonymous Supabase client for PUBLIC reads (e.g. public_profiles).
 * Because it never touches cookies/session, pages using it aren't forced
 * dynamic by the auth layer and the read is fast and cacheable.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
