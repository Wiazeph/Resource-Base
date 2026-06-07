import type { Metadata } from "next";
import { FavoritesClient } from "@/components/favorites-client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allResourcesQuery } from "@/sanity/lib/queries";
import type { Resource } from "@/lib/types";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Resources you've saved.",
};

export default async function FavoritesPage() {
  const resources = await sanityFetch<Resource[]>({
    query: allResourcesQuery,
    tags: ["resource"],
  });
  return <FavoritesClient resources={resources} />;
}
