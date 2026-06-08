import type { Metadata } from "next";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { AuthGate } from "@/components/auth/auth-gate";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit profile",
  robots: { index: false, follow: false },
};

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      {user ? <ProfileEditForm /> : <AuthGate>{null}</AuthGate>}
    </div>
  );
}
