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

  const PRICINGS = ["free", "freemium", "paid"];
  const pricing = PRICINGS.includes(data.pricing) ? data.pricing : undefined;
  // Tags arrive comma-separated; normalize to a clean, deduped, capped list.
  const tags = Array.from(
    new Set(
      String(data.tags ?? "")
        .split(",")
        .map((tg) => tg.trim().slice(0, 40))
        .filter(Boolean),
    ),
  ).slice(0, 10);

  // A "fix" targets an existing resource (its url is wrong); "new" is a brand
  // new resource suggestion.
  const kind = data.kind === "fix" ? "fix" : "new";
  const targetResourceId =
    kind === "fix" ? (data.targetResourceId ?? "").trim() : "";
  if (kind === "fix" && !targetResourceId) {
    return new NextResponse("Missing target resource", { status: 400 });
  }

  const fields = {
    name: name.slice(0, 200),
    url,
    suggestedCategory: (data.suggestedCategory ?? "").slice(0, 100),
    pricing,
    tags,
    note: (data.note ?? "").slice(0, 1000),
  };

  // Resubmit path: the user edited a previously rejected submission. We update
  // that same doc back to "pending" (clearing the rejection reason) instead of
  // creating a duplicate. Ownership is enforced against submittedBy.
  const resubmitId = (data.submissionId ?? "").trim();

  try {
    const admin = createAdminClient();

    if (resubmitId) {
      // Verify the doc belongs to this user and is rejected before touching it.
      const existing = await writeClient.fetch<{
        submittedBy?: string;
        status?: string;
      } | null>(`*[_id == $id][0]{submittedBy, status}`, { id: resubmitId });

      if (!existing || existing.submittedBy !== userId) {
        return new NextResponse("Not found", { status: 404 });
      }
      // Editing is allowed while a submission is still in the queue (pending)
      // or was rejected. Approved submissions are live and immutable here.
      if (existing.status !== "rejected" && existing.status !== "pending") {
        return new NextResponse("This submission can no longer be edited", {
          status: 409,
        });
      }

      await writeClient
        .patch(resubmitId)
        .set({ ...fields, status: "pending" })
        .unset(["rejectionReason"])
        .commit();

      await admin
        .from("submissions")
        .update({
          name: fields.name,
          url: fields.url,
          suggested_category: fields.suggestedCategory,
          pricing: fields.pricing ?? null,
          tags: fields.tags,
          note: fields.note,
          status: "pending",
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("sanity_submission_id", resubmitId)
        .eq("user_id", userId);

      return NextResponse.json({ ok: true, resubmitted: true });
    }

    const created = await writeClient.create({
      _type: "submission",
      ...fields,
      kind,
      ...(kind === "fix" ? { targetResourceId } : {}),
      email: email.slice(0, 200),
      submittedBy: userId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Mirror to Supabase so the submission is tied to the user and the
    // approval notification can find its target. Best-effort.
    try {
      await admin.from("submissions").insert({
        user_id: userId,
        sanity_submission_id: created._id,
        kind,
        target_resource_id: targetResourceId || null,
        name: fields.name,
        url: fields.url,
        suggested_category: fields.suggestedCategory,
        pricing: fields.pricing ?? null,
        tags: fields.tags,
        note: fields.note,
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
