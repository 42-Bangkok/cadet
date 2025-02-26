import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schemas/*/**",
  dialect: "postgresql",
  dbCredentials: {
    url: `${process.env["DRIZZLE_DATABASE_URL"]}`,
  },
  verbose: true,
  strict: true,
});
