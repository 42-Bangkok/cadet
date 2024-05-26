import { relations } from "drizzle-orm";
import {
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

export const usersToRoles = pgTable(
  "userToRoles",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    roleId: integer("roleId")
      .notNull()
      .references(() => roles.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  })
);

/**
 * Stores pre-assign roles for non-existing users.
 * If the user does not exist yet the role is stored here.
 * When the user is created, the role is assigned to the user.
 */
export const roleAssignQueues = pgTable("roleAssignQueues", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  roleId: integer("roleId")
    .references(() => roles.id, { onDelete: "cascade" })
    .notNull(),
});
