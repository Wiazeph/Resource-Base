import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Per-instance debounce: the same IP+resource only counts once per window.
// Not perfect across serverless instances, but it kills casual spam (repeat
// clicks, page-refresh re-counts). Upgrade to Upstash if abuse appears.
const WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours
const seen = new Map<string, number>();

function recentlyCounted(key: string): boolean {
  const now = Date.now();
  const expires = seen.get(key);
  if (expires && expires > now) return true;
  seen.set(key, now + WINDOW_MS);
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (seen.size > 10_000) {
    for (const [k, exp] of seen) if (exp < now) seen.delete(k);
  }
  return false;
}

export async function POST(req: NextRequest) {
  let resourceId: unknown;
  try {
    ({ resourceId } = await req.json());
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  if (typeof resourceId !== "string" || !resourceId) {
    return new NextResponse("Missing resourceId", { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Within the window → ack without counting (UI already bumped optimistically).
  if (recentlyCounted(`${ip}:${resourceId}`)) {
    return NextResponse.json({ counted: false });
  }

  try {
    await createAdminClient().rpc("increment_click", { rid: resourceId });
    return NextResponse.json({ counted: true });
  } catch (err) {
    console.error("click increment failed", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
