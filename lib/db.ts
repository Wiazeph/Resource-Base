import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/lib/db/schema";

/**
 * Per-request Drizzle factory. The D1 binding (`env.DB`) only exists inside a
 * request context, so call this INSIDE a handler / server action / server
 * component — never memoize at module scope (env is undefined there).
 */
export function getDb() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

/** Async form for statically-evaluated contexts (generateStaticParams, build). */
export async function getDbAsync() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}
