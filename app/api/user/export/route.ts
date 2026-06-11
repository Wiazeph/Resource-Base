import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GDPR/KVKK data portability: returns all of the signed-in user's data as a
 * downloadable JSON file. Reads are RLS-scoped to the caller, so a user can
 * only ever export their own data.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  // RLS already scopes every table to the caller; the explicit user_id filters
  // are belt-and-braces so the export stays correct even if a policy changes.
  const [profile, favorites, submissions, notifications] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("favorites").select("*").eq("user_id", user.id),
    supabase.from("submissions").select("*").eq("user_id", user.id),
    supabase.from("notifications").select("*").eq("user_id", user.id),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email },
    profile: profile.data ?? null,
    favorites: favorites.data ?? [],
    submissions: submissions.data ?? [],
    notifications: notifications.data ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="resource-base-data.json"',
    },
  });
}
