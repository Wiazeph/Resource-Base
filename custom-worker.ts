// Custom Worker entrypoint: wraps the OpenNext-generated worker (fetch) and adds
// a scheduled() handler for the Cloudflare Cron Trigger (link checker). The cron
// invokes scheduled() directly — no HTTP route, no bearer secret.
// @ts-ignore `.open-next/worker.js` is generated at build time
import { default as handler } from "./.open-next/worker.js";
import { runLinkCheck } from "@/lib/check-links";

export default {
  fetch: handler.fetch,
  async scheduled(_event, _env, ctx) {
    ctx.waitUntil(
      runLinkCheck().catch((err) =>
        console.error("cron link-check failed", err),
      ),
    );
  },
} satisfies ExportedHandler<CloudflareEnv>;
