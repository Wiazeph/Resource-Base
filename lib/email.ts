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

type KvBinding = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, opts?: { expirationTtl?: number }) => Promise<void>;
};

// Global hard ceiling on emails per day, regardless of source. Per-IP rate
// limiting (Better Auth) stops a single attacker; this is the circuit breaker
// against DISTRIBUTED abuse exhausting the sending quota / running up cost.
// Kept under Cloudflare Email Sending's 200/day quota.
const MAX_EMAILS_PER_DAY = 150;

/** Best-effort daily counter in KV. Returns true if under the cap (safe to send). */
async function underDailyCap(kv: KvBinding | undefined): Promise<boolean> {
  if (!kv) return true; // no KV (local/dev) → don't block
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const key = `email-count:${day}`;
  const current = Number((await kv.get(key)) ?? "0");
  if (current >= MAX_EMAILS_PER_DAY) return false;
  // KV is eventually consistent, so this count is approximate — fine for a cap.
  await kv.put(key, String(current + 1), { expirationTtl: 172800 }); // 2 days
  return true;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const { env } = getCloudflareContext();
  const e = env as unknown as Record<string, unknown>;
  const emailBinding = e.EMAIL as EmailBinding | undefined;
  const kv = e.NEXT_INC_CACHE_KV as KvBinding | undefined;

  if (!emailBinding) {
    // No EMAIL binding (free plan / local dev): don't block the auth flow.
    console.warn(
      `[email] EMAIL binding unavailable; skipped send to ${opts.to} (${opts.subject})`,
    );
    return;
  }

  // Circuit breaker: hard daily cap across all senders.
  if (!(await underDailyCap(kv))) {
    console.error(
      `[email] daily cap (${MAX_EMAILS_PER_DAY}) reached; skipped send to ${opts.to}`,
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
