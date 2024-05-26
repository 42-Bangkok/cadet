import { autoTimestamp } from "@/drizzle/schemas/commons";
import { relations } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { users } from "./authjs";

/**
 * Role for RBAC
 */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description").default("").notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const usersToRoles = pgTable("userToRoles", {
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  roleId: integer("roleId")
    .notNull()
    .references(() => roles.id),
});
