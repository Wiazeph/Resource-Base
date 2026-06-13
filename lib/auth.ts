import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

/** Stem a display name/email into a username base, then add a short suffix. */
function usernameStem(raw: string | null | undefined): string {
  const cleaned = (raw ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
  return cleaned || "user";
}

/**
 * Better Auth instance — built PER REQUEST (the Drizzle adapter depends on the
 * per-request D1 binding from getCloudflareContext(); env is undefined at module
 * scope on workerd). Always `await getAuth()`.
 */
export async function getAuth() {
  const { env } = getCloudflareContext();
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    // Cloudflare passes the real client IP in cf-connecting-ip. Without this,
    // Better Auth can't identify clients and lumps everyone into one shared
    // rate-limit bucket → spurious 429s (and reset requests never reaching
    // sendResetPassword).
    advanced: {
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"] },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // instant signup, no verification email
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your Resource Base password",
          text: `Reset your password: ${url}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
          html: `<p>Reset your password by clicking the link below:</p>
<p><a href="${url}">Reset password</a></p>
<p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`,
        });
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
      gitlab: {
        clientId: env.GITLAB_CLIENT_ID,
        clientSecret: env.GITLAB_CLIENT_SECRET,
      },
    },
    account: {
      accountLinking: {
        // Link providers that share the same verified email to one account, so
        // signing in with Google/GitHub/GitLab/email for the same address all
        // resolve to a single user (avoids the "account_not_linked" error).
        enabled: true,
        trustedProviders: ["google", "github", "gitlab"],
      },
    },
    databaseHooks: {
      user: {
        create: {
          // Auto-assign a unique username on signup (replaces handle_new_user).
          after: async (createdUser) => {
            const stem = usernameStem(createdUser.name || createdUser.email);
            for (let i = 0; i < 6; i++) {
              const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 5);
              try {
                await db
                  .update(schema.user)
                  .set({ username: `${stem}-${suffix}` })
                  .where(eq(schema.user.id, createdUser.id));
                break;
              } catch (e) {
                if (String(e).includes("UNIQUE")) continue;
                throw e;
              }
            }
          },
        },
      },
    },
    user: {
      additionalFields: {
        username: { type: "string", required: false, input: false },
        fullName: { type: "string", required: false },
        bio: { type: "string", required: false },
        portfolioUrl: { type: "string", required: false },
        githubUrl: { type: "string", required: false },
        twitterUrl: { type: "string", required: false },
        instagramUrl: { type: "string", required: false },
        dribbbleUrl: { type: "string", required: false },
        showEmail: { type: "boolean", required: false, defaultValue: false },
      },
    },
    plugins: [nextCookies()], // MUST be last
  });
}
