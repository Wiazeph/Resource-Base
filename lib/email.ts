import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Single send helper. ALL outbound email goes through here, so swapping the
 * transport (or adding a fallback) later is a one-file change.
 *
 * Transport: Cloudflare Email Sending (the modern structured API). Requires the
 * Workers Paid plan, the domain enabled in Email Sending (SPF/DKIM/DMARC), and
 * the `send_email` binding `EMAIL` in wrangler.jsonc. The `from` domain must be
 * verified or sends fail with E_SENDER_NOT_VERIFIED.
 *
 * NOTE: this uses the new `env.EMAIL.send({ to, from, subject, html, text })`
 * API — NOT the legacy `cloudflare:email` EmailMessage/MIME flow (that's the
 * old Email Routing binding and doesn't work with Email Sending).
 */
type EmailBinding = {
  send: (msg: {
    to: string;
    from: string;
    subject: string;
    html?: string;
    text?: string;
  }) => Promise<unknown>;
};

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const { env } = getCloudflareContext();
  const emailBinding = (env as unknown as Record<string, unknown>).EMAIL as
    | EmailBinding
    | undefined;

  if (!emailBinding) {
    // No EMAIL binding (free plan / local dev): don't block the auth flow.
    console.warn(
      `[email] EMAIL binding unavailable; skipped send to ${opts.to} (${opts.subject})`,
    );
    return;
  }

  const from = env.EMAIL_FROM || "noreply@resource-base.com";
  await emailBinding.send({
    to: opts.to,
    from,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}
