import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categorySlugsQuery, tagSlugsQuery } from "@/sanity/lib/queries";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, tags] = await Promise.all([
    sanityFetch<string[]>({ query: categorySlugsQuery, tags: ["category"] }),
    sanityFetch<string[]>({ query: tagSlugsQuery, tags: ["tag"] }),
  ]);

  const staticPaths = ["", "/categories", "/submit"];

  return [
    ...staticPaths.map((p) => ({
      url: `${siteUrl}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...categories.map((slug) => ({
      url: `${siteUrl}/category/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tags.map((slug) => ({
      url: `${siteUrl}/tag/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
