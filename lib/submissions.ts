"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import type { Submission } from "@/lib/types";

/**
 * Loads the signed-in user's own submissions (RLS-scoped via "read own"), so
 * they can track pending/approved/rejected status. Reloads on window focus so
 * a moderation decision shows up without a manual refresh.
 */
export function useSubmissions() {
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
    const { data } = await supabase
      .from("submissions")
      .select(
        "id, sanity_submission_id, name, url, status, suggested_category, pricing, tags, note, rejection_reason, created_at, updated_at",
      )
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

  return { items, loading, reload: load };
}
