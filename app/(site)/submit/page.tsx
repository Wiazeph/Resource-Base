import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";
import { AuthGate } from "@/components/auth/auth-gate";
import { createClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Submit a resource",
  description: "Suggest a free resource to add to the directory.",
};

export default async function SubmitPage() {
  // Server-side gate: don't fetch or render the form for signed-out visitors.
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
      <SubmitForm categories={categories} />
    </div>
  );
}
