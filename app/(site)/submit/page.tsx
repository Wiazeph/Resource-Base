import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allCategoriesQuery } from "@/sanity/lib/queries";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Submit a resource",
  description: "Suggest a free resource to add to the directory.",
};

export default async function SubmitPage() {
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
