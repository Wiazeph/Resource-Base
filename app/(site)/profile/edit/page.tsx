import type { Metadata } from "next";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { MySubmissionsSection } from "@/components/my-submissions-section";
import { AuthGate } from "@/components/auth/auth-gate";
import { createClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Edit profile",
  robots: { index: false, follow: false },
};

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <AuthGate>{null}</AuthGate>
      </div>
    );
  }

  const categories = await sanityFetch<Category[]>({
    query: allCategoriesQuery,
    tags: ["category"],
  });

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <ProfileEditForm />
      <MySubmissionsSection categories={categories} />
    </div>
  );
}
