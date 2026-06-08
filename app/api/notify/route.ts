import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ApprovalBody = {
  _id: string;
  status: string;
  submittedBy?: string;
  name?: string;
  url?: string;
};

/**
 * Sanity webhook → Supabase notification.
 * Configure a webhook in sanity.io/manage filtered to
 *   _type == "submission" && status == "approved"
 * projecting { _id, status, submittedBy, name, url }, POSTing here with
 * SANITY_NOTIFY_SECRET. When an editor approves a user's submission, the
 * submitter gets an in-app notification.
 */
export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = await parseBody<ApprovalBody>(
      req,
      process.env.SANITY_NOTIFY_SECRET,
    );
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }

  const { isValidSignature, body } = parsed;
  if (!isValidSignature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }
  if (!body || body.status !== "approved") {
    // Not an approval event — ack so Sanity doesn't retry.
    return NextResponse.json({ skipped: true });
  }
  if (!body.submittedBy) {
    // Anonymous submission — no one to notify.
    return NextResponse.json({ skipped: "no user" });
  }

  const supabase = createAdminClient();

  // Idempotent: source_key has a unique index, so webhook retries are no-ops.
  const { error } = await supabase.from("notifications").insert({
    user_id: body.submittedBy,
    type: "submission_approved",
    title: "Your resource was approved 🎉",
    body: body.name
      ? `“${body.name}” is now live in the directory.`
      : "Your submitted resource is now live in the directory.",
    url: body.url ?? null,
    source_key: `submission_approved:${body._id}`,
  });

  // Also flip the mirror row's status (best-effort).
  await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("sanity_submission_id", body._id);

  // Duplicate-key error means we already notified — treat as success.
  if (error && error.code !== "23505") {
    console.error("notify insert failed", error);
    return new NextResponse("Server error", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
