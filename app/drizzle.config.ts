import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schemas/*/**",
  driver: "pg",
  dbCredentials: {
    connectionString: `${process.env["DRIZZLE_DATABASE_URL"]}`,
  },
  verbose: true,
  strict: true,
});
