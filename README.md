# Resource Base

A curated, searchable directory of the best resources for **development**, **design**, and — over time — anything else worth collecting. Browse ~500 hand-picked tools, libraries and references across a multi-level category and tag taxonomy, search them instantly, save your favorites, and suggest improvements. Built as a real, production application in **5 languages** with full control over design and data.

![Resource Base](./thumbnail/Resource-Base.png)

## Features

| Feature | Signed out | Signed in | How it works |
| --- | :---: | :---: | --- |
| **Browse & filter** | ✅ | ✅ | Explore by category, tag, pricing and language; sort by featured, popularity, favorites, name or recency. |
| **Instant search** | ✅ | ✅ | A self-built ⌘K command palette with fuzzy matching across every resource, category and tag — no third-party search service. |
| **Resource details** | ✅ | ✅ | Each resource has a deep-linkable, shareable page with full description, taxonomy, related resources and rich SEO/OG metadata. |
| **Favorites** | — | ✅ | Save resources to your account and revisit them on a dedicated page. |
| **Submit a resource** | — | ✅ | Suggest a new resource; every submission is reviewed before going live. |
| **Suggest edits** | — | ✅ | Propose better categories, tags or a clearer description for any resource — reviewed, then applied automatically on approval. |
| **Notifications** | — | ✅ | Get notified when your submission or suggestion is approved or needs changes. |
| **Your data** | — | ✅ | Export everything you've contributed as JSON, or permanently delete your account — self-service (GDPR / KVKK). |

> Content lives in a headless CMS, so resources are added, fixed and re-categorised without shipping code. A daily cron quietly checks every link and flags the broken ones for review.

## How it works

- **Browsing & search** are fully public and instant. Filters and the ⌘K palette run client-side over a tag-cached dataset, so navigating between categories, tags and resources feels immediate.
- **Signing in** (Google, GitHub, or email) unlocks the personal layer — favorites, submissions, suggestions and notifications — all scoped to your own account.
- **Submitting & suggesting** never touch the live directory directly. Your contribution is stored as a moderated submission; an editor reviews it, and on approval the change is applied to the resource automatically and you're notified.
- **Content updates go live without a redeploy** — a CMS webhook revalidates just the affected pages on demand.

## Languages

The entire interface is available in **English, Turkish, Spanish, French and German**, switchable from the header. Your choice is remembered.

## Tech stack

- **Next.js (App Router) + React + TypeScript** — the application
- **Tailwind CSS + shadcn/ui + Radix** — design system and accessible primitives
- **Sanity** — headless CMS for resources, categories, tags and submissions (Studio embedded at `/studio`)
- **Supabase** — authentication (OAuth + email) and user data, protected end-to-end with Row Level Security
- **cmdk + Fuse.js** — the self-built command palette and fuzzy search
- **Vercel** — hosting, Cron (broken-link checker), and Analytics

## Privacy & security

- **Your data is scoped to you.** Every user table (profile, favorites, submissions, notifications) is protected by database-level Row Level Security, so one account can never read or modify another's data — enforced by the database itself, not just the app.
- **Secrets stay on the server.** Service-role and CMS write tokens live only in server-only modules and never reach the browser; the client only ever sees public, anon-level keys.
- **Hardened by default.** A strict Content-Security-Policy, HSTS, `X-Frame-Options`, `nosniff` and a safe-redirect auth callback ship in the production config. Webhooks are signature-verified; the link-checker cron is secret-gated and fails closed.
- **You're in control of your data.** Export a full JSON copy of everything you've contributed, or delete your account permanently — both self-service, no email required (GDPR Art. 17 & 20 / KVKK).
- **Analytics are privacy-respecting** and gated behind cookie consent.

## Local development

1. Copy the env template and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   Key variables (see `.env.example` for the full, documented list):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN` (Viewer) and `SANITY_API_WRITE_TOKEN` (Editor)
   - `SANITY_REVALIDATE_SECRET`, `SANITY_NOTIFY_SECRET`, `CRON_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - Google/GitHub OAuth credentials are configured in the Supabase dashboard, not as app env vars.
2. Install dependencies and run the dev server:
   ```bash
   pnpm install
   pnpm dev
   ```
3. Open `http://localhost:3000` — the embedded Studio is at `/studio`.

### Database

User-data schema and policies live in `supabase/migrations/`. Apply them with the Supabase CLI:

```bash
supabase db push
```

### Importing the legacy content

The original markdown lives in `_migration-source/`. To (re)import into Sanity:

```bash
pnpm migrate:dry   # parse + summarise, write nothing
pnpm migrate       # import (idempotent — safe to re-run)
```

## Deploying

Deploy to Vercel and set the environment variables above in the project settings. Then:

- Add a Sanity webhook (**sanity.io/manage → API → Webhooks**) pointing at `/api/revalidate` (content revalidation) and `/api/notify` (submission-approval notifications), each sharing its respective secret.
- The broken-link checker runs daily via the cron defined in `vercel.json`, authorized with `CRON_SECRET`.

## Disclaimer

Resource Base is an independent directory. Listed resources are the property of their respective owners and are linked for discovery; inclusion does not imply any affiliation or endorsement.

## Feedback & contact

- **Found a bug or want to suggest a resource the directory is missing?** Open an issue, or submit it right inside the app.
- **Anything else?** Email **emreerden@pm.me** or visit [emreerden.dev](https://emreerden.dev).

---

Created by [Emre Erden](https://emreerden.dev).
