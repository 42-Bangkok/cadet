/**
 * Notes on m-m relations:
 * To allow query builder "with" to work these are required
 *
 */

import { relations } from "drizzle-orm";
import { pgTable, text, primaryKey, serial } from "drizzle-orm/pg-core";
import { users } from "./authjs";

/**
 * Roles for RBAC
 */
export const roles = pgTable("roles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").unique(),
  description: text("description").default("").notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  usersToRoles: many(usersToRoles),
}));

export const usersToRoles = pgTable(
  "usersToRoles",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    roleId: text("roleId")
      .notNull()
      .references(() => roles.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  })
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
  user: one(users, {
    fields: [usersToRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [usersToRoles.roleId],
    references: [roles.id],
  }),
}));

/**
 * Stores pre-assign roles for non-existing users.
 * If the user does not exist yet the role is stored here.
 * When the user is created, the role is assigned to the user.
 */
export const roleAssignQueues = pgTable("roleAssignQueues", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  roleId: text("roleId")
    .references(() => roles.name, { onDelete: "cascade" })
    .notNull(),
});
