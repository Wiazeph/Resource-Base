"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyProfile,
  updateProfile,
  setUsername as setUsernameAction,
} from "@/lib/profile-actions";
import { useAuth } from "@/components/auth/auth-provider";
import type { Profile } from "@/lib/types";

export type EditableProfile = Pick<
  Profile,
  | "full_name"
  | "bio"
  | "portfolio_url"
  | "github_url"
  | "twitter_url"
  | "instagram_url"
  | "dribbble_url"
  | "show_email"
>;

type DbProfile = NonNullable<Awaited<ReturnType<typeof getMyProfile>>>;

// Map a camelCase Drizzle user row to the app's snake_case Profile shape.
function toProfile(row: DbProfile, email: string | null): Profile {
  return {
    id: row.id,
    email,
    username: row.username,
    full_name: row.fullName,
    avatar_url: row.image,
    bio: row.bio,
    portfolio_url: row.portfolioUrl,
    github_url: row.githubUrl,
    twitter_url: row.twitterUrl,
    instagram_url: row.instagramUrl,
    dribbble_url: row.dribbbleUrl,
    show_email: row.showEmail,
  } as Profile;
}

// Map snake_case editable fields to the camelCase server-action shape.
const KEY_MAP: Record<keyof EditableProfile, string> = {
  full_name: "fullName",
  bio: "bio",
  portfolio_url: "portfolioUrl",
  github_url: "githubUrl",
  twitter_url: "twitterUrl",
  instagram_url: "instagramUrl",
  dribbble_url: "dribbbleUrl",
  show_email: "showEmail",
};

/** Loads + updates the signed-in user's own profile (own only). */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const row = await getMyProfile();
    setProfile(row ? toProfile(row, user.email ?? null) : null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (fields: Partial<EditableProfile>) => {
      if (!user) return { error: "not authenticated" };
      const patch: Record<string, unknown> = {};
      for (const k of Object.keys(fields) as (keyof EditableProfile)[]) {
        patch[KEY_MAP[k]] = fields[k];
      }
      const { error } = await updateProfile(patch);
      if (!error) await load();
      return { error };
    },
    [user, load],
  );

  const setUsername = useCallback(
    async (next: string): Promise<{ error: string | null }> => {
      const res = await setUsernameAction(next);
      if (!res.error) await load();
      return res;
    },
    [load],
  );

  return { profile, loading, update, setUsername, reload: load };
}

// Public reads (server actions) — re-export so existing import sites keep working.
export {
  fetchPublicProfile,
  fetchProfilesByIds,
  fetchPublicEmail,
} from "@/lib/profile-actions";
