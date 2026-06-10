import 'server-only'

import { client } from './client'

/**
 * Tag-based cached fetch. Pages render statically and are revalidated
 * on-demand when a Sanity webhook hits /api/revalidate (revalidateTag).
 * No redeploy needed for a content edit. The 1-hour `revalidate` is a safety
 * net so content can't go stale indefinitely if a webhook delivery is missed.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = ['sanity'],
  revalidate = 3600,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number | false
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { tags, revalidate },
  })
}
