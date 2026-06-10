"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { useFavoriteCounts } from "@/components/favorite-counts-provider";

type FavoritesValue = {
  ids: string[];
  loading: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

/**
 * Single source of truth for the signed-in user's favorites. Fetched once,
 * updated optimistically, shared across every card and the favorites page —
 * so favoriting on the home page is instantly reflected everywhere (no refresh).
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { bump } = useFavoriteCounts();
  const supabase = useMemo(() => createClient(), []);
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("favorites")
      .select("resource_id")
      .then(({ data }) => {
        if (!active) return;
        setIds((data ?? []).map((r) => r.resource_id as string));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, supabase]);

  const toggle = useCallback(
    async (id: string) => {
      if (!user) return; // callers open the auth modal instead
      const isFav = ids.includes(id);
      // Optimistic — instant across all consumers via shared context.
      setIds((prev) => (isFav ? prev.filter((x) => x !== id) : [...prev, id]));
      // Keep the public favorite count in sync optimistically too.
      bump(id, isFav ? -1 : 1);

      const { error } = isFav
        ? await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("resource_id", id)
        : await supabase
            .from("favorites")
            .insert({ user_id: user.id, resource_id: id });

      // On failure, revert the optimistic UI so it never lies about state.
      if (error) {
        setIds((prev) =>
          isFav ? [...prev, id] : prev.filter((x) => x !== id),
        );
        bump(id, isFav ? 1 : -1);
        toast.error(t("card.favoriteError"));
      }
    },
    [user, ids, supabase, bump, t],
  );

  const value = useMemo<FavoritesValue>(
    () => ({ ids, loading, has: (id) => ids.includes(id), toggle }),
    [ids, loading, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return (
    useContext(FavoritesContext) ?? {
      ids: [],
      loading: false,
      has: () => false,
      toggle: async () => {},
    }
  );
}
