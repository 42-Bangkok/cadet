import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schemas/";

/**
 * Single client is instantiated and shared across the application.
 * This Postgres client is used by Drizzle ORM.
 */

declare global {
  var drizzle: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

const DRIZZLE_DATABASE_URL = process.env["DRIZZLE_DATABASE_URL"] ?? "";

if (process.env.NODE_ENV !== "production") {
  if (!global.drizzle)
    global.drizzle = drizzle(postgres(DRIZZLE_DATABASE_URL), {
      schema,
    });

  db = global.drizzle;
} else {
  db = drizzle(postgres(DRIZZLE_DATABASE_URL), { schema });
}

export { db };
