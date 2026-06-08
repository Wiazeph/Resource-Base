"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = useMemo(() => createClient(), []);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    supabase
      .from("resource_clicks")
      .select("resource_id, count")
      .then(({ data }) => {
        if (!active || !data) return;
        const map: Record<string, number> = {};
        for (const row of data)
          map[row.resource_id as string] = Number(row.count);
        setCounts(map);
      });
    return () => {
      active = false;
    };
  }, [supabase]);

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
