import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const linkCodes = pgTable("link_codes", {
  id: serial("id").primaryKey(),
  discordId: varchar("discord_id", { length: 255 }).notNull(),
  linkCode: varchar("link_code", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LinkCode = typeof linkCodes.$inferSelect;
export type NewLinkCode = typeof linkCodes.$inferInsert;
