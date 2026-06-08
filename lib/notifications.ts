"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export type Notification = {
  id: string;
  title: string | null;
  body: string | null;
  url: string | null;
  read_at: string | null;
  created_at: string;
};

/**
 * Loads the signed-in user's notifications (RLS-scoped) and exposes the unread
 * count plus a markAllRead helper. Refetches on window focus.
 */
export function useNotifications() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Notification[]>([]);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    const { data } = await supabase
      .from("notifications")
      .select("id, title, body, url, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    setItems(data ?? []);
  }, [user, supabase]);

  useEffect(() => {
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const unread = items.filter((n) => !n.read_at).length;

  const markAllRead = useCallback(async () => {
    const ids = items.filter((n) => !n.read_at).map((n) => n.id);
    if (ids.length === 0) return;
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })));
    await supabase
      .from("notifications")
      .update({ read_at: now })
      .in("id", ids);
  }, [items, supabase]);

  return { items, unread, markAllRead, reload: load };
}
