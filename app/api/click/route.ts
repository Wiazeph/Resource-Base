import { type NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { resourceClicks } from "@/lib/db/schema";

export const runtime = "nodejs";

// Per-instance debounce: same IP+resource counts once per window. Best-effort
// across Worker isolates — kills casual spam (repeat clicks, refresh re-counts).
const WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours
const seen = new Map<string, number>();

function recentlyCounted(key: string): boolean {
  const now = Date.now();
  const expires = seen.get(key);
  if (expires && expires > now) return true;
  seen.set(key, now + WINDOW_MS);
  if (seen.size > 10_000) {
    for (const [k, exp] of seen) if (exp < now) seen.delete(k);
  }
  return false;
}

export async function POST(req: NextRequest) {
  let resourceId: unknown;
  try {
    ({ resourceId } = (await req.json()) as { resourceId?: unknown });
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  if (typeof resourceId !== "string" || !resourceId) {
    return new NextResponse("Missing resourceId", { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (recentlyCounted(`${ip}:${resourceId}`)) {
    return NextResponse.json({ counted: false });
  }

  try {
    // Atomic UPSERT — replaces the increment_click() RPC.
    await getDb()
      .insert(resourceClicks)
      .values({ resourceId, count: 1, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: resourceClicks.resourceId,
        set: { count: sql`${resourceClicks.count} + 1`, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("click increment failed", error);
    return new NextResponse("Server error", { status: 500 });
  }
  return NextResponse.json({ counted: true });
}
