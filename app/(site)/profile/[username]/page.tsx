import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { resourcesBySubmitterQuery } from "@/sanity/lib/queries";
import { PublicProfileView } from "@/components/public-profile";
import type { PublicProfile, Resource } from "@/lib/types";

// Profiles are reachable only via resource-card links — keep them out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

async function loadProfile(username: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_profiles")
    .select("*")
    .ilike("username", username)
    .maybeSingle();
  return (data as PublicProfile) ?? null;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();

  const resources = await sanityFetch<Resource[]>({
    query: resourcesBySubmitterQuery,
    params: { userId: profile.id },
    tags: ["resource"],
  });

  return <PublicProfileView profile={profile} resources={resources} />;
}
