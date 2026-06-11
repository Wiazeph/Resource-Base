import { type NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";
import { writeClient } from "@/sanity/lib/writeClient";

export const runtime = "nodejs";
export const maxDuration = 60;

const BATCH = 80; // resources per run; the full set is covered over a few runs
const CONCURRENCY = 10;
const TIMEOUT_MS = 9000;
// A realistic browser UA gets past many naive bot filters.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Hosts that serve misleading 4xx to non-browser clients even though the page
// works fine in a real browser. Their non-OK responses are "suspect", never
// "broken", so we don't flag working links.
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
    // Try HEAD first; many servers 405 it, so fall back to GET.
    let res = await fetch(url, { ...opts, method: "HEAD" });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { ...opts, method: "GET" });
    }
    const code = res.status;
    if (code >= 200 && code < 300) return { status: "ok", httpStatus: code };
    if (code >= 300 && code < 400) return { status: "redirect", httpStatus: code };
    // Bot-blocking / rate-limiting → suspect, not broken (avoids false positives).
    if (code === 403 || code === 429) return { status: "suspect", httpStatus: code };
    // Known bot-hostile hosts lie with 4xx — never mark them broken.
    if (hostile) return { status: "suspect", httpStatus: code };
    return { status: "broken", httpStatus: code };
  } catch {
    // DNS failure, timeout, connection refused, etc. On bot-hostile hosts this
    // is more likely a block than a real outage.
    return { status: hostile ? "suspect" : "broken" };
  }
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Require the secret
  // to be configured AND match — a missing secret must fail closed, not open,
  // so this link-checker can never be triggered anonymously (it fans out HTTP
  // requests per resource, which is exactly what we don't want exposed).
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const resources = await writeClient.fetch<
    { _id: string; url: string }[]
  >(
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

  return NextResponse.json({ checked: resources.length, ...summary });
}
