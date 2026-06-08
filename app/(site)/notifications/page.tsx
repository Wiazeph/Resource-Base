import type { Metadata } from "next";
import { NotificationsClient } from "@/components/notifications/notifications-client";
import { AuthGate } from "@/components/auth/auth-gate";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <AuthGate>{null}</AuthGate>
      </div>
    );
  }

  return <NotificationsClient />;
}
