"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getFavoriteCounts } from "@/lib/data-actions";

type FavoriteCountsValue = {
  get: (resourceId: string) => number;
  /** Optimistically adjust a count (delta +1 / -1) when the user toggles. */
  bump: (resourceId: string, delta: number) => void;
};

const FavoriteCountsContext = createContext<FavoriteCountsValue | null>(null);

export function useFavoriteCounts() {
  const ctx = useContext(FavoriteCountsContext);
  // Safe fallback so cards render even if the provider is absent.
  return ctx ?? { get: () => 0, bump: () => {} };
}

/**
 * Loads how many users have favorited each resource once (public read via the
 * favorite_counts RPC — the favorites table itself is read-own-only). Mirrors
 * ClickCountsProvider: `bump` optimistically adjusts locally when the signed-in
 * user toggles their own favorite, so the count moves instantly.
 */
export function FavoriteCountsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    getFavoriteCounts().then((map) => {
      if (active) setCounts(map);
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<FavoriteCountsValue>(
    () => ({
      get: (id) => counts[id] ?? 0,
      bump: (id, delta) =>
        setCounts((prev) => ({
          ...prev,
          [id]: Math.max(0, (prev[id] ?? 0) + delta),
        })),
    }),
    [counts],
  );

  return (
    <FavoriteCountsContext.Provider value={value}>
      {children}
    </FavoriteCountsContext.Provider>
  );
}
