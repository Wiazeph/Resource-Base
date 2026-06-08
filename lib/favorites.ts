"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

const EVENT = "rb:favorites-changed";

/**
 * Favorites are account-only (Supabase). For anonymous users the hook returns
 * an empty set — the UI shows an empty star and prompts sign-in on click
 * (handled in ResourceCard). Signed-in favorites sync across devices.
 */
export function useFavorites() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    if (!user) {
      setIds([]);
      return;
    }

    const load = () => {
      supabase
        .from("favorites")
        .select("resource_id")
        .then(({ data }) => {
          if (active) setIds((data ?? []).map((r) => r.resource_id as string));
        });
    };
    load();
    window.addEventListener(EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(EVENT, load);
    };
  }, [user, supabase]);

  const toggle = useCallback(
    async (id: string) => {
      if (!user) return; // guard — callers open the auth modal instead
      const isFav = ids.includes(id);
      setIds((prev) => (isFav ? prev.filter((x) => x !== id) : [...prev, id]));
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
    },
    [user, ids, supabase],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}
