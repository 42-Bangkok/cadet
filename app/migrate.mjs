/**
 * This file is used to migrate the database on cloud deployments
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
const sql = postgres(`${process.env["DRIZZLE_DATABASE_URL"]}`, { max: 1 });
const db = drizzle(sql);
await migrate(db, { migrationsFolder: "drizzle/migrations" });
await sql.end();
