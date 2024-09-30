import { defineConfig } from "drizzle-kit"

const DATABASE_URL = process.env.DATABASE_URL

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./neon/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
})
