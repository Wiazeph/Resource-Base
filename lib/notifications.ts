"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listNotifications,
  markNotificationsRead,
  type NotificationRow,
} from "@/lib/data-actions";
import { useAuth } from "@/components/auth/auth-provider";

export type Notification = NotificationRow;

/**
 * Loads the signed-in user's notifications (own only, server action) and
 * exposes the unread count plus a markAllRead helper.
 */
export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setItems(await listNotifications());
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const unread = items.filter((n) => !n.read_at).length;

  const markAllRead = useCallback(async () => {
    const ids = items.filter((n) => !n.read_at).map((n) => n.id);
    if (ids.length === 0) return;
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })));
    await markNotificationsRead(ids);
  }, [items]);

  return { items, unread, markAllRead, reload: load };
}
