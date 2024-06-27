import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "../users";
import { relations } from "drizzle-orm";

/**
 * Represents a slot for evaluation, which is a time slot for a tutor to evaluate a team.
 * If booked, teamLeader will be the id of the team leader.
 */
export const evaluationSlots = pgTable(
  "evaluationSlot",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    startDateTime: timestamp("startDateTime", { mode: "date" }).notNull(),
    evaluatorUserId: text("evaluatorUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    teamLeaderUserId: text("teamLeaderId").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (t) => ({
    unq: unique().on(t.startDateTime, t.evaluatorUserId),
  })
);

export const evaluationSlotsRelations = relations(
  evaluationSlots,
  ({ one }) => ({
    evaluator: one(users, {
      fields: [evaluationSlots.evaluatorUserId],
      references: [users.id],
    }),
    teamLeader: one(users, {
      fields: [evaluationSlots.teamLeaderUserId],
      references: [users.id],
    }),
  })
);
