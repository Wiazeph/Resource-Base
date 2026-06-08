import type { Metadata } from "next";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
