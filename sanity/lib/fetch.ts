import 'server-only'

import { client } from './client'

/**
 * Tag-based cached fetch. Pages render statically and are revalidated
 * on-demand when a Sanity webhook hits /api/revalidate (revalidateTag).
 * No redeploy needed for a content edit.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = ['sanity'],
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { tags },
  })
}
