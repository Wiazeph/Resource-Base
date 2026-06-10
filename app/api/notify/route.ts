import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ModerationBody = {
  _id: string;
  status: string;
  submittedBy?: string;
  name?: string;
  url?: string;
  rejectionReason?: string;
};

/**
 * Sanity webhook → Supabase notification + mirror sync.
 * Configure a webhook in sanity.io/manage filtered to
 *   _type == "submission" && (status == "approved" || status == "rejected")
 * projecting { _id, status, submittedBy, name, url, rejectionReason }, POSTing
 * here with SANITY_NOTIFY_SECRET. When an editor approves or rejects a user's
 * submission, the submitter gets an in-app notification and the mirror row's
 * status is updated so their "My submissions" view reflects it.
 */
export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = await parseBody<ModerationBody>(
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
  if (!body || (body.status !== "approved" && body.status !== "rejected")) {
    // Not a moderation decision — ack so Sanity doesn't retry.
    return NextResponse.json({ skipped: true });
  }
  if (!body.submittedBy) {
    // Anonymous submission — no one to notify.
    return NextResponse.json({ skipped: "no user" });
  }

  const supabase = createAdminClient();
  const approved = body.status === "approved";
  const label = body.name ? `“${body.name}”` : "Your submitted resource";

  // Idempotent: source_key has a unique index, so webhook retries are no-ops.
  // The status is part of the key so an approve-after-reject still notifies.
  const { error } = await supabase.from("notifications").insert({
    user_id: body.submittedBy,
    type: approved ? "submission_approved" : "submission_rejected",
    title: approved
      ? "Your resource was approved 🎉"
      : "Your submission needs changes",
    body: approved
      ? `${label} is now live in the directory.`
      : body.rejectionReason
        ? `${label} wasn’t approved: ${body.rejectionReason}`
        : `${label} wasn’t approved. You can edit and resubmit it.`,
    url: approved ? (body.url ?? null) : "/profile/edit",
    source_key: `submission_${body.status}:${body._id}`,
  });

  // Sync the mirror row so "My submissions" reflects the decision.
  await supabase
    .from("submissions")
    .update({
      status: body.status,
      rejection_reason: approved ? null : (body.rejectionReason ?? null),
      updated_at: new Date().toISOString(),
    })
    .eq("sanity_submission_id", body._id);

  // Duplicate-key error means we already notified — treat as success.
  if (error && error.code !== "23505") {
    console.error("notify insert failed", error);
    return new NextResponse("Server error", { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
