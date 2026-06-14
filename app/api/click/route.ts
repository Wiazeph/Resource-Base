import { type NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { resourceClicks } from "@/lib/db/schema";
import { alreadySeen } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Dedup: same IP+resource counts at most once per window. Backed by KV (shared
// across Worker isolates and persistent), so — unlike an in-memory Map — it
// can't be reset by forcing a cold start. This is what stops a bot inflating a
// resource's click count / trending rank by hammering the public endpoint; the
// link itself still opens, only the COUNT is debounced. The user never notices.
const CLICK_DEDUP_WINDOW_SEC = 24 * 60 * 60; // 24 hours

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
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (await alreadySeen(`click:${ip}:${resourceId}`, CLICK_DEDUP_WINDOW_SEC)) {
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
