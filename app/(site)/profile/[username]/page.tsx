import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allCategoriesQuery,
  resourcesBySubmitterQuery,
} from "@/sanity/lib/queries";
import { PublicProfileView } from "@/components/public-profile";
import type { Category, PublicProfile, Resource } from "@/lib/types";

// Profiles are reachable only via resource-card links — keep them out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Cookie-free anonymous read → fast, no session round-trip.
  const supabase = createPublicClient();
  const { data: profile } = await supabase
    .from("public_profiles")
    .select("*")
    .ilike("username", username)
    .maybeSingle<PublicProfile>();
  if (!profile) notFound();

  // Both queries are tag-cached + CDN-served, so this stays cheap. Categories
  // feed the owner-only "My submissions" resubmit modal.
  const [resources, categories] = await Promise.all([
    sanityFetch<Resource[]>({
      query: resourcesBySubmitterQuery,
      params: { userId: profile.id },
      tags: ["resource"],
    }),
    sanityFetch<Category[]>({ query: allCategoriesQuery, tags: ["category"] }),
  ]);

  return (
    <PublicProfileView
      profile={profile}
      resources={resources}
      categories={categories}
    />
  );
}
