"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchProfilesByIds } from "@/lib/profile";
import type { PublicProfileCompact } from "@/lib/types";

type ContributorsValue = {
  /** Register a submitter id to be resolved (batched). */
  register: (id: string) => void;
  /** Look up a resolved contributor by user id. */
  get: (id: string) => PublicProfileCompact | undefined;
};

const ContributorsContext = createContext<ContributorsValue | null>(null);

export function useContributors() {
  return (
    useContext(ContributorsContext) ?? {
      register: () => {},
      get: () => undefined,
    }
  );
}

/**
 * Cards register their submittedBy id here; the provider batches all pending
 * ids into a single public_profiles query so attribution costs one request,
 * not one per card.
 */
export function ContributorsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [map, setMap] = useState<Record<string, PublicProfileCompact>>({});
  const pending = useRef<Set<string>>(new Set());
  const requested = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    const ids = [...pending.current].filter((id) => !requested.current.has(id));
    pending.current.clear();
    if (ids.length === 0) return;
    ids.forEach((id) => requested.current.add(id));
    const fetched = (await fetchProfilesByIds(ids)) as Record<
      string,
      PublicProfileCompact
    >;
    if (Object.keys(fetched).length > 0) {
      setMap((prev) => ({ ...prev, ...fetched }));
    }
  }, []);

  const register = useCallback(
    (id: string) => {
      if (!id || requested.current.has(id) || pending.current.has(id)) return;
      pending.current.add(id);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, 80);
    },
    [flush],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const value = useMemo<ContributorsValue>(
    () => ({ register, get: (id) => map[id] }),
    [register, map],
  );

  return (
    <ContributorsContext.Provider value={value}>
      {children}
    </ContributorsContext.Provider>
  );
}
