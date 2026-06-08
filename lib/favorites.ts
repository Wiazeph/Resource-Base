"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

const KEY = "rb:favorites";
const EVENT = "rb:favorites-changed";

// --- localStorage layer (anonymous users) ---------------------------------

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLocal(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * One-time merge of anonymous localStorage favorites into a freshly signed-in
 * user's account, then clears the local copy. Called from AuthProvider.
 */
export async function migrateLocalFavorites(
  supabase: SupabaseClient,
  userId: string,
) {
  const local = readLocal();
  if (local.length === 0) return;
  await supabase
    .from("favorites")
    .upsert(
      local.map((resource_id) => ({ user_id: userId, resource_id })),
      { onConflict: "user_id,resource_id", ignoreDuplicates: true },
    );
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

// --- hybrid hook ------------------------------------------------------------

/**
 * Favorites hook. Anonymous → localStorage. Signed in → Supabase (cross-device).
 * Signature is stable ({ ids, toggle, has }) so consumers don't change.
 */
export function useFavorites() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [ids, setIds] = useState<string[]>([]);

  // Load + keep in sync, branching on auth state.
  useEffect(() => {
    let active = true;

    if (user) {
      supabase
        .from("favorites")
        .select("resource_id")
        .then(({ data }) => {
          if (active) setIds((data ?? []).map((r) => r.resource_id as string));
        });
      const onChange = () => {
        supabase
          .from("favorites")
          .select("resource_id")
          .then(({ data }) => {
            if (active)
              setIds((data ?? []).map((r) => r.resource_id as string));
          });
      };
      window.addEventListener(EVENT, onChange);
      return () => {
        active = false;
        window.removeEventListener(EVENT, onChange);
      };
    }

    // Anonymous
    setIds(readLocal());
    const sync = () => setIds(readLocal());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      active = false;
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [user, supabase]);

  const toggle = useCallback(
    async (id: string) => {
      if (user) {
        const isFav = ids.includes(id);
        // Optimistic
        setIds((prev) =>
          isFav ? prev.filter((x) => x !== id) : [...prev, id],
        );
        if (isFav) {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("resource_id", id);
        } else {
          await supabase
            .from("favorites")
            .insert({ user_id: user.id, resource_id: id });
        }
        window.dispatchEvent(new Event(EVENT));
        return;
      }
      // Anonymous
      const current = readLocal();
      writeLocal(
        current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id],
      );
    },
    [user, ids, supabase],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}
