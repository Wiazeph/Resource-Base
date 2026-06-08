import { type NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/writeClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Tiny in-memory rate limit (per warm instance). Good enough to blunt abuse;
// upgrade to Upstash Redis if it becomes a real target.
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Auth is required — derive the user from the verified server session, never
  // from the request body (so a client cannot spoof someone else's userId or
  // submit anonymously).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return new NextResponse("Invalid body", { status: 400 });
  }

  // Honeypot: real users never fill this.
  if (data.company) return NextResponse.json({ ok: true });

  const name = (data.name ?? "").trim();
  const url = (data.url ?? "").trim();
  if (!name || !isValidUrl(url)) {
    return new NextResponse("Name and a valid URL are required", {
      status: 400,
    });
  }

  // Identity comes from the session, not the body.
  const userId = user.id;
  const email = user.email ?? "";

  try {
    const created = await writeClient.create({
      _type: "submission",
      name: name.slice(0, 200),
      url,
      suggestedCategory: (data.suggestedCategory ?? "").slice(0, 100),
      note: (data.note ?? "").slice(0, 1000),
      email: email.slice(0, 200),
      submittedBy: userId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Mirror to Supabase so the submission is tied to the user and the
    // approval notification can find its target. Best-effort.
    try {
      await createAdminClient().from("submissions").insert({
        user_id: userId,
        sanity_submission_id: created._id,
        name: name.slice(0, 200),
        url,
        status: "pending",
      });
    } catch (mirrorErr) {
      console.error("submission mirror failed", mirrorErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("submission failed", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
