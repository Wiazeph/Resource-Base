import type { Metadata } from "next";
import { FavoritesClient } from "@/components/favorites-client";
import { AuthGate } from "@/components/auth/auth-gate";
import { createClient } from "@/lib/supabase/server";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allResourcesQuery } from "@/sanity/lib/queries";
import type { Resource } from "@/lib/types";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Resources you've saved.",
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AuthGate>{null}</AuthGate>
      </div>
    );
  }

  const resources = await sanityFetch<Resource[]>({
    query: allResourcesQuery,
    tags: ["resource"],
  });
  return <FavoritesClient resources={resources} />;
}
