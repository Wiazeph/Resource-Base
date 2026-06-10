"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import type { Submission } from "@/lib/types";

const SELECT =
  "id, sanity_submission_id, kind, target_resource_id, name, url, status, suggested_category, pricing, tags, proposed_categories, proposed_tags, note, rejection_reason, created_at, updated_at";

type SubmissionsValue = {
  items: Submission[];
  loading: boolean;
  reload: () => Promise<void>;
};

const SubmissionsContext = createContext<SubmissionsValue | null>(null);

/**
 * Loads the signed-in user's submissions ONCE (RLS-scoped) and shares them via
 * context, so every resource modal can read "do I have a pending suggestion?"
 * synchronously — no per-card query, no flicker between "Suggest edit" and
 * "Suggestion pending". Reloads on window focus to pick up moderation changes.
 */
export function SubmissionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("submissions")
      .select(SELECT)
      .order("created_at", { ascending: false });
    setItems((data as Submission[]) ?? []);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const value = useMemo<SubmissionsValue>(
    () => ({ items, loading, reload: load }),
    [items, loading, load],
  );

  return createElement(SubmissionsContext.Provider, { value }, children);
}

export function useSubmissions(): SubmissionsValue {
  return (
    useContext(SubmissionsContext) ?? {
      items: [],
      loading: false,
      reload: async () => {},
    }
  );
}
