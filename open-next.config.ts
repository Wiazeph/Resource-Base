import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// No R2: page cache on Workers KV, tag cache on D1 (powers the Sanity
// revalidateTag webhook). The Durable Object queue handles ISR revalidation —
// required because pages use time-based revalidate profiles; without it
// OpenNext throws "Dummy queue is not implemented" when a stale page revalidates.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
  enableCacheInterception: true,
});
