import { timestamp } from "drizzle-orm/pg-core";

// Common fields for all tables related to timestamps
export const autoTimestamp = {
  created: timestamp("created", { mode: "date" }).notNull().defaultNow(),
  updated: timestamp("updated", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deleted: timestamp("deleted", { mode: "date" }),
} as const;
