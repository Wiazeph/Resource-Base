"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import type { Profile, PublicProfile } from "@/lib/types";

const EDITABLE_COLUMNS = [
  "full_name",
  "bio",
  "portfolio_url",
  "github_url",
  "twitter_url",
  "instagram_url",
  "dribbble_url",
] as const;

export type EditableProfile = Pick<
  Profile,
  (typeof EDITABLE_COLUMNS)[number]
>;

/** Loads + updates the signed-in user's own profile (RLS-scoped). */
export function useProfile() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, email, username, full_name, avatar_url, bio, portfolio_url, github_url, twitter_url, instagram_url, dribbble_url",
      )
      .eq("id", user.id)
      .single();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  /** Update the editable (non-username) fields. */
  const update = useCallback(
    async (fields: Partial<EditableProfile>) => {
      if (!user) return { error: "not authenticated" };
      const patch: Record<string, unknown> = {};
      for (const key of EDITABLE_COLUMNS) {
        if (key in fields) patch[key] = fields[key] ?? null;
      }
      const { error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id);
      if (!error) await load();
      return { error: error?.message ?? null };
    },
    [user, supabase, load],
  );

  /** Change username via the validated, unique-checked RPC. */
  const setUsername = useCallback(
    async (next: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.rpc("set_username", {
        new_username: next,
      });
      if (error) {
        // Map known DB exceptions to friendly codes the UI can translate.
        if (error.message.includes("username_taken"))
          return { error: "username_taken" };
        if (error.message.includes("invalid_username"))
          return { error: "invalid_username" };
        return { error: error.message };
      }
      await load();
      return { error: null };
    },
    [supabase, load],
  );

  return { profile, loading, update, setUsername, reload: load };
}

/** Public read of a profile by username (from the public_profiles view). */
export async function fetchPublicProfile(
  username: string,
): Promise<PublicProfile | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("*")
    .ilike("username", username)
    .maybeSingle();
  return (data as PublicProfile) ?? null;
}

/** Bulk-fetch public profiles by user id (for resource-card attribution). */
export async function fetchProfilesByIds(
  ids: string[],
): Promise<Record<string, PublicProfile>> {
  if (ids.length === 0) return {};
  const supabase = createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("id, username, full_name, avatar_url")
    .in("id", ids);
  const map: Record<string, PublicProfile> = {};
  for (const row of (data ?? []) as PublicProfile[]) map[row.id] = row;
  return map;
}
