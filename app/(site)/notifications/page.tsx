import type { Metadata } from "next";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

// Auth enforced in middleware (PROTECTED_PAGES) — no redundant server getUser().
// NotificationsClient handles the signed-out UX fallback.
export default function NotificationsPage() {
  return <NotificationsClient />;
}
