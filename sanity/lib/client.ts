import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Read client used by the public site. CDN-backed, no token — safe to use in
 * Server Components. Caching is handled by Next.js via `sanityFetch`.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
