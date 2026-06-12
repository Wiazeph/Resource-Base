import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// NOTE: Next 16 renames middleware → proxy, but @opennextjs/cloudflare does NOT
// yet support the new proxy.ts convention (OpenNext issue #962 / workers-sdk
// #13755). The legacy `middleware.ts` + `middleware` export still works (only a
// deprecation warning) and builds correctly on OpenNext. Keep this until OpenNext
// ships proxy support. Backed by Supabase here; swapped to Better Auth in Phase 4.
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on everything except static assets, the Studio, and the cron route.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|studio|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
