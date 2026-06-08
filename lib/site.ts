/** Canonical site URL, used for sitemap, JSON-LD and metadata. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const siteName = "Resource Base";
export const siteDescription =
  "A curated, searchable directory of free resources for everything — from quirky web toys to serious science.";
