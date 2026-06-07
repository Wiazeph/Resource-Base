import { defineCliConfig } from 'sanity/cli'

// projectId/dataset are public, non-secret values. Hard-coded here so the CLI
// (which doesn't read .env.local) can deploy/build without extra env wiring.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  '77o1dw6w'
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production'

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: { autoUpdates: true },
})
