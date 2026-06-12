"use server";

import { and, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getSessionUser, requireUser } from "@/lib/authz";

const USERNAME_RE = /^[a-z0-9_-]{3,20}$/;

const EDITABLE = [
  "fullName",
  "bio",
  "portfolioUrl",
  "githubUrl",
  "twitterUrl",
  "instagramUrl",
  "dribbbleUrl",
  "showEmail",
] as const;
type EditableKey = (typeof EDITABLE)[number];
export type EditableProfileInput = Partial<
  Record<Exclude<EditableKey, "showEmail">, string | null> & {
    showEmail: boolean;
  }
>;

/** Validate + set a unique username (replaces set_username RPC). Own row only. */
export async function setUsername(
  next: string,
): Promise<{ error: string | null }> {
  const me = await requireUser();
  const cleaned = next.trim().toLowerCase();
  if (!USERNAME_RE.test(cleaned)) return { error: "invalid_username" };

  const db = getDb();
  const clash = await db
    .select({ id: user.id })
    .from(user)
    .where(and(sql`lower(${user.username}) = ${cleaned}`, ne(user.id, me.id)))
    .limit(1);
  if (clash.length > 0) return { error: "username_taken" };

  try {
    await db.update(user).set({ username: cleaned }).where(eq(user.id, me.id));
  } catch (e) {
    if (String(e).includes("UNIQUE")) return { error: "username_taken" };
    throw e;
  }
  return { error: null };
}

/** Read the current user's own profile row (own only). */
export async function getMyProfile() {
  const me = await getSessionUser();
  if (!me) return null;
  const db = getDb();
  const [row] = await db.select().from(user).where(eq(user.id, me.id)).limit(1);
  return row ?? null;
}

/** Update editable profile fields (own only). */
export async function updateProfile(
  fields: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const me = await requireUser();
  const patch: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (key in fields) patch[key] = fields[key] ?? null;
  }
  if (Object.keys(patch).length === 0) return { error: null };
  patch.updatedAt = new Date();
  await getDb().update(user).set(patch).where(eq(user.id, me.id));
  return { error: null };
}

/* ---- public reads (no auth) — replace public_profiles view + public_email --- */

// snake_case projection matching the app's PublicProfile / PublicProfileCompact.
const PUBLIC_COLUMNS = {
  id: user.id,
  username: user.username,
  full_name: user.fullName,
  avatar_url: user.image,
  bio: user.bio,
  portfolio_url: user.portfolioUrl,
  github_url: user.githubUrl,
  twitter_url: user.twitterUrl,
  instagram_url: user.instagramUrl,
  dribbble_url: user.dribbbleUrl,
  show_email: user.showEmail,
} as const;

export async function fetchPublicProfile(username: string) {
  const db = getDb();
  const [row] = await db
    .select(PUBLIC_COLUMNS)
    .from(user)
    .where(
      and(
        sql`lower(${user.username}) = ${username.toLowerCase()}`,
        isNotNull(user.username),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function fetchProfilesByIds(ids: string[]) {
  if (ids.length === 0)
    return {} as Record<
      string,
      { id: string; username: string | null; full_name: string | null; avatar_url: string | null }
    >;
  const db = getDb();
  const rows = await db
    .select({
      id: user.id,
      username: user.username,
      full_name: user.fullName,
      avatar_url: user.image,
    })
    .from(user)
    .where(and(isNotNull(user.username), inArray(user.id, ids)));
  const map: Record<string, (typeof rows)[number]> = {};
  for (const r of rows) map[r.id] = r;
  return map;
}

/** Email only if the user opted in (replaces public_email RPC). */
export async function fetchPublicEmail(userId: string): Promise<string | null> {
  const db = getDb();
  const [row] = await db
    .select({ email: user.email })
    .from(user)
    .where(
      and(
        eq(user.id, userId),
        eq(user.showEmail, true),
        isNotNull(user.username),
      ),
    )
    .limit(1);
  return row?.email ?? null;
}
