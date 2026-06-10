import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";

/**
 * GDPR/KVKK right to erasure: permanently deletes the signed-in user's account
 * and all associated data. The identity comes from the verified server session
 * (never the body), so a user can only delete their own account.
 *
 * Order: anonymize the user's Sanity submission docs (so nothing ties back to
 * them), then delete the auth user — which cascades all public tables
 * (profiles, favorites, notifications via on-delete-cascade FKs) and sets
 * submissions.user_id to null. Published resources stay; their submitter
 * attribution is cleared.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  let body: { confirm?: string };
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid body", { status: 400 });
  }
  // Require an explicit confirmation token to avoid accidental deletion.
  if (body.confirm !== "DELETE") {
    return new NextResponse("Confirmation required", { status: 400 });
  }

  const userId = user.id;

  // 1) Anonymize this user's Sanity submissions (best-effort).
  try {
    await writeClient
      .patch({ query: `*[_type == "submission" && submittedBy == $uid]`, params: { uid: userId } })
      .unset(["submittedBy", "email"])
      .commit();
  } catch (err) {
    console.error("sanity anonymize failed", err);
  }

  const admin = createAdminClient();

  // 2) Remove the user's submission mirror rows (FK is on-delete-set-null, so
  //    deleting the auth user alone would leave orphaned rows behind).
  try {
    await admin.from("submissions").delete().eq("user_id", userId);
  } catch (err) {
    console.error("submissions delete failed", err);
  }

  // 3) Delete the auth user (cascades public.profiles/favorites/notifications).
  //    Service role required.
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("auth user delete failed", error);
    return new NextResponse("Server error", { status: 500 });
  }

  // 4) Sign the now-orphaned session out (clears cookies).
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
