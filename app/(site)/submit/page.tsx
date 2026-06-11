import { SubmitForm } from "@/components/submit-form";
import type { Category } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a resource",
  description: "Suggest a resource to add to the directory.",
};

// Auth enforced in middleware (PROTECTED_PAGES → redirects signed-out visitors),
// so no redundant server getUser(). SubmitForm gates on the client too.
export default async function SubmitPage() {
  const categories = await sanityFetch<Category[]>({
    query: allCategoriesQuery,
    tags: ["category"],
  });

  return (
    <div className="mx-auto max-w-2xl">
      <SubmitForm categories={categories} />
    </div>
  );
}
