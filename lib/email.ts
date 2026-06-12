import { createMimeMessage } from "mimetext";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Single send helper. ALL outbound email goes through here, so swapping the
 * transport (or adding a Resend fallback) later is a one-file change.
 *
 * Transport: Cloudflare Email Sending (public beta) — requires the Workers PAID
 * plan + a domain enabled via `wrangler email sending enable <domain>` and the
 * `send_email` binding `EMAIL` in wrangler.jsonc. Until then sends are a no-op
 * (logged), so signup/OAuth work on the free plan; password-reset emails start
 * flowing the moment the plan is upgraded — no code change needed.
 *
 * NOTE: `cloudflare:email` is a workerd-only module that breaks the build if
 * imported statically. We resolve it indirectly at runtime so neither webpack
 * nor esbuild tries to bundle it.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const { env } = getCloudflareContext();
  const emailBinding = (env as unknown as Record<string, unknown>).EMAIL as
    | { send: (msg: unknown) => Promise<void> }
    | undefined;

  if (!emailBinding) {
    // No EMAIL binding (free plan / local dev): don't block the auth flow.
    console.warn(`[email] EMAIL binding unavailable; skipped send to ${opts.to} (${opts.subject})`);
    return;
  }

  const from = env.EMAIL_FROM || "noreply@localhost";
  const msg = createMimeMessage();
  msg.setSender({ name: "Resource Base", addr: from });
  msg.setRecipient(opts.to);
  msg.setSubject(opts.subject);
  msg.addMessage({ contentType: "text/plain", data: opts.text });
  msg.addMessage({ contentType: "text/html", data: opts.html });

  // Resolve `cloudflare:email` through an indirect import that neither webpack
  // nor esbuild can statically analyze (both choke on the workerd-only module).
  // workerd provides it natively at runtime.
  const dynImport = new Function("m", "return import(m)") as (
    m: string,
  ) => Promise<{
    EmailMessage: new (from: string, to: string, raw: string) => unknown;
  }>;
  const { EmailMessage } = await dynImport("cloudflare:email");
  const message = new EmailMessage(from, opts.to, msg.asRaw());
  await emailBinding.send(message);
}
