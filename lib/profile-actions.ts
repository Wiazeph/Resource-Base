"use server";

import { headers } from "next/headers";
import { and, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getAuth } from "@/lib/auth";
import { getSessionUser, requireUser } from "@/lib/authz";
import { isRateLimited } from "@/lib/rate-limit";

const PW_MIN = 8;
const PW_MAX = 64;

/**
 * Set a password for the CURRENT user when they don't have one yet (signed up
 * via OAuth only). Better Auth's setPassword is server-only, so it's wrapped
 * here. Rejected if the user already has a credential account — they must use
 * changePassword (which requires the current password) instead, so this can't
 * be used to overwrite an existing password without knowing it.
 */
export async function setMyPassword(
  newPassword: string,
): Promise<{ error: string | null }> {
  await requireUser();
  if (newPassword.length < PW_MIN || newPassword.length > PW_MAX)
    return { error: "invalid_password" };

  const auth = await getAuth();
  const hdrs = await headers();

  const accounts = await auth.api.listUserAccounts({ headers: hdrs });
  const hasCredential = (accounts ?? []).some(
    (a: { providerId?: string }) => a.providerId === "credential",
  );
  if (hasCredential) return { error: "password_exists" };

  await auth.api.setPassword({ body: { newPassword }, headers: hdrs });
  return { error: null };
}

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
  // A human changes their handle rarely; cap at 5/hour to stop a script from
  // hammering the uniqueness query + write. Far above any real use.
  if (await isRateLimited(`username:${me.id}`, 5, 3600))
    return { error: "rate_limited" };

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

// Server-side length caps (anti-abuse — never trust the client).
const MAX_LEN: Record<string, number> = {
  fullName: 60,
  bio: 280,
  portfolioUrl: 200,
  githubUrl: 200,
  twitterUrl: 200,
  instagramUrl: 200,
  dribbbleUrl: 200,
};

/** Update editable profile fields (own only). Caps lengths server-side. */
export async function updateProfile(
  fields: Record<string, unknown>,
): Promise<{ error: string | null }> {
  const me = await requireUser();
  const patch: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (!(key in fields)) continue;
    let v = fields[key] ?? null;
    if (typeof v === "string") {
      v = v.trim();
      const cap = MAX_LEN[key];
      if (cap && (v as string).length > cap) return { error: "too_long" };
      if (v === "") v = null;
    }
    patch[key] = v;
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
