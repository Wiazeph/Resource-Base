import { defineConfig } from "drizzle-kit";

// drizzle-kit only GENERATES SQL migrations from the schema. Applying them to
// D1 is done by wrangler (`pnpm db:migrate:local` / `:remote`), which reads the
// SQL files in ./drizzle.
export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
});
