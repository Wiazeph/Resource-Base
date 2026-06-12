import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";

// No R2: page cache on Workers KV, tag cache on D1 (powers the Sanity
// revalidateTag webhook). No Durable Object queue — we only use on-demand
// revalidation, not time-based ISR.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  enableCacheInterception: true,
});
