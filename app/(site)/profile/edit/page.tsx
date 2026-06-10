import type { Metadata } from "next";
import { ProfileEditForm } from "@/components/profile-edit-form";

export const metadata: Metadata = {
  title: "Edit profile",
  robots: { index: false, follow: false },
};

// Auth enforced in middleware (PROTECTED_PAGES). ProfileEditForm gates on the
// client (shows a sign-in prompt) as a fallback, so no server getUser() here.
export default function ProfileEditPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <ProfileEditForm />
    </div>
  );
}
