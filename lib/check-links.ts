import pLimit from "p-limit";
import { writeClient } from "@/sanity/lib/writeClient";

const BATCH = 80; // resources per run; the full set is covered over a few runs
const CONCURRENCY = 10;
const TIMEOUT_MS = 9000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Hosts that serve misleading 4xx to non-browser clients even though the page
// works in a real browser. Their non-OK responses are "suspect", never "broken".
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

async function check(
  url: string,
): Promise<{ status: Status; httpStatus?: number }> {
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
    if (code >= 300 && code < 400)
      return { status: "redirect", httpStatus: code };
    if (code === 403 || code === 429)
      return { status: "suspect", httpStatus: code };
    if (hostile) return { status: "suspect", httpStatus: code };
    return { status: "broken", httpStatus: code };
  } catch {
    return { status: hostile ? "suspect" : "broken" };
  }
}

export type LinkCheckSummary = {
  checked: number;
  ok: number;
  broken: number;
  redirect: number;
  suspect: number;
};

/**
 * Batch link-health check over Sanity resources, writing results back to Sanity.
 * Pure (only Sanity + fetch) so it runs from both the HTTP route (manual) and
 * the Workers scheduled() cron handler. No user auth / no Supabase.
 */
export async function runLinkCheck(): Promise<LinkCheckSummary> {
  const resources = await writeClient.fetch<{ _id: string; url: string }[]>(
    `*[_type == "resource" && manualOverride != true]
       | order(coalesce(lastCheckedAt, "1970-01-01") asc)[0...$batch]{ _id, url }`,
    { batch: BATCH },
  );

  const limit = pLimit(CONCURRENCY);
  const now = new Date().toISOString();
  const summary = { ok: 0, broken: 0, redirect: 0, suspect: 0 };

  const tx = writeClient.transaction();
  await Promise.all(
    resources.map((r) =>
      limit(async () => {
        const { status, httpStatus } = await check(r.url);
        summary[status] += 1;
        tx.patch(r._id, {
          set: {
            linkStatus: status,
            lastCheckedAt: now,
            ...(httpStatus ? { httpStatus } : {}),
          },
        });
      }),
    ),
  );

  if (resources.length > 0) await tx.commit({ visibility: "async" });

  return { checked: resources.length, ...summary };
}
