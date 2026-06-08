import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { sanityFetch } from "@/sanity/lib/fetch";
import { resourcesBySubmitterQuery } from "@/sanity/lib/queries";
import { PublicProfileView } from "@/components/public-profile";
import type { PublicProfile, Resource } from "@/lib/types";

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

  const resources = await sanityFetch<Resource[]>({
    query: resourcesBySubmitterQuery,
    params: { userId: profile.id },
    tags: ["resource"],
  });

  return <PublicProfileView profile={profile} resources={resources} />;
}
