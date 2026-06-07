import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

/**
 * Read client used by the public site (Server Components only — it carries a
 * Viewer token, so it must never be imported into a Client Component).
 * Caching is handled by Next.js via `sanityFetch` (tag-based, revalidated by
 * the Sanity webhook), so we don't rely on Sanity's CDN here.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "published",
});
