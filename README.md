# Resource Base

A curated, searchable directory of the best free resources for developers and
designers — and, over time, for any category worth collecting. Built as a real
application with full control over design and data.

Originally a VitePress documentation site, now a Next.js + Sanity directory with
~500 resources, fuzzy search, multi-tag/multi-category taxonomy, automated
broken-link checking, community submissions and favorites.

## Stack

- **Next.js (App Router)** + **Tailwind CSS** + **shadcn/ui** — the app and design
- **Sanity** — headless CMS; add/remove/fix resources without committing code
- **cmdk + Fuse.js** — self-built ⌘K command palette + fuzzy search (no Algolia)
- **Vercel** — hosting, Cron (broken-link checker) and Analytics

## Architecture

| Concern | Where |
| --- | --- |
| Content (resources, categories, tags, submissions) | Sanity — Studio embedded at `/studio` |
| Public pages | `app/(site)/` — home, `/browse`, `/category/[...slug]`, `/tag/[slug]`, `/favorites`, `/submit` |
| Data layer | `sanity/lib/` (read client + GROQ + tag-cached fetch) |
| Search & filters | `components/browse-client.tsx`, `components/command-palette.tsx` (client-side) |
| Favorites | `lib/favorites.ts` (localStorage) |
| Submissions | `app/api/submit/route.ts` → Sanity `submission` doc (moderated) |
| Broken-link checker | `app/api/cron/check-links/route.ts` + `vercel.json` cron |
| Content edits go live | Sanity webhook → `app/api/revalidate/route.ts` (no redeploy) |
| Legacy SEO | 301 redirects in `next.config.ts` |

## Local development

1. Copy env and fill in your Sanity values:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN` (Viewer role) — used server-side by the read client
   - `SANITY_API_WRITE_TOKEN` (Editor role) — migration, submissions, cron
   - `SANITY_REVALIDATE_SECRET`, `CRON_SECRET`
2. Install and run:
   ```bash
   pnpm install
   pnpm dev
   ```
3. Open `http://localhost:3000`, Studio at `/studio`.

## Migrating the legacy markdown

The original VitePress markdown lives in `_migration-source/`. To (re)import:

```bash
pnpm migrate:dry   # parse + summarise, write nothing
pnpm migrate       # import into Sanity (idempotent — safe to re-run)
```

## Deploying

Deploy to Vercel, set the env vars above in the project settings, and add a
Sanity webhook (sanity.io/manage → API → Webhooks) pointing at
`/api/revalidate` with the `SANITY_REVALIDATE_SECRET` and projection
`{ "_type": _type }`. The broken-link cron runs daily via `vercel.json`.

---

Created by [Emre Erden](https://emreerden.dev).
