"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getClickCounts } from "@/lib/data-actions";

type ClickCountsValue = {
  get: (resourceId: string) => number;
  bump: (resourceId: string) => void;
};

const ClickCountsContext = createContext<ClickCountsValue | null>(null);

export function useClickCounts() {
  const ctx = useContext(ClickCountsContext);
  // Safe fallback so cards render even if the provider is absent.
  return ctx ?? { get: () => 0, bump: () => {} };
}

/**
 * Loads all resource click counts once (public read, a few KB) and exposes them
 * via context. `bump` optimistically increments locally; the actual increment
 * is fired by the card via the increment_click RPC.
 */
export function ClickCountsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    getClickCounts().then((map) => {
      if (active) setCounts(map);
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<ClickCountsValue>(
    () => ({
      get: (id) => counts[id] ?? 0,
      bump: (id) =>
        setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 })),
    }),
    [counts],
  );

  return (
    <ClickCountsContext.Provider value={value}>
      {children}
    </ClickCountsContext.Provider>
  );
}
