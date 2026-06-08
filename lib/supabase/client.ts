import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (anon key). Safe in Client Components — RLS scopes
 * every read/write to the signed-in user.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
