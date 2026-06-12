import { createClient } from "@sanity/client";

// Standalone Cloudflare Worker: daily link-health check over Sanity resources.
// Runs on a Cron Trigger (scheduled handler) — kept separate from the main
// OpenNext app so that app stays a clean fetch-only worker. Writes results
// (linkStatus / lastCheckedAt / httpStatus) back to Sanity. No user auth.

interface Env {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_VERSION: string;
  SANITY_API_WRITE_TOKEN: string;
}

const BATCH = 80;
const CONCURRENCY = 10;
const TIMEOUT_MS = 9000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const BOT_HOSTILE_HOSTS = [
  "marketplace.visualstudio.com",
  "chromewebstore.google.com",
  "chrome.google.com",
  "addons.mozilla.org",
];

function isBotHostile(url: string): boolean {
  try {
    return BOT_HOSTILE_HOSTS.some((h) => new URL(url).hostname.endsWith(h));
  } catch {
    return false;
  }
}

type Status = "ok" | "broken" | "redirect" | "suspect";

async function check(url: string): Promise<{ status: Status; httpStatus?: number }> {
  const opts: RequestInit = {
    redirect: "manual",
    headers: { "user-agent": UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  };
  const hostile = isBotHostile(url);
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { ...opts, method: "GET" });
    }
    const code = res.status;
    if (code >= 200 && code < 300) return { status: "ok", httpStatus: code };
    if (code >= 300 && code < 400) return { status: "redirect", httpStatus: code };
    if (code === 403 || code === 429) return { status: "suspect", httpStatus: code };
    if (hostile) return { status: "suspect", httpStatus: code };
    return { status: "broken", httpStatus: code };
  } catch {
    return { status: hostile ? "suspect" : "broken" };
  }
}

async function runLinkCheck(env: Env): Promise<void> {
  const client = createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: env.SANITY_API_VERSION,
    token: env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  });

  const resources = await client.fetch<{ _id: string; url: string }[]>(
    `*[_type == "resource" && manualOverride != true]
       | order(coalesce(lastCheckedAt, "1970-01-01") asc)[0...$batch]{ _id, url }`,
    { batch: BATCH },
  );

  const now = new Date().toISOString();
  const tx = client.transaction();

  // Simple concurrency limiter (no p-limit dependency).
  let i = 0;
  async function worker() {
    while (i < resources.length) {
      const r = resources[i++];
      const { status, httpStatus } = await check(r.url);
      tx.patch(r._id, {
        set: {
          linkStatus: status,
          lastCheckedAt: now,
          ...(httpStatus ? { httpStatus } : {}),
        },
      });
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, resources.length) }, () => worker()),
  );

  if (resources.length > 0) await tx.commit({ visibility: "async" });
  console.log(`link-check: processed ${resources.length} resources`);
}

export default {
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      runLinkCheck(env).catch((err) => console.error("link-check failed", err)),
    );
  },
} satisfies ExportedHandler<Env>;
