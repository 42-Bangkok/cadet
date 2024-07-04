import { boolean, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
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
    teamLeaderUserId: text("teamLeaderUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    isEvaluated: boolean("isEvaluated").notNull().default(false),
  },
  (t) => ({
    unq: unique().on(t.startDateTime, t.evaluatorUserId),
  })
);

export const evaluationSlotsRelations = relations(
  evaluationSlots,
  ({ one, many }) => ({
    evaluator: one(users, {
      fields: [evaluationSlots.evaluatorUserId],
      references: [users.id],
    }),
    teamLeader: one(users, {
      fields: [evaluationSlots.teamLeaderUserId],
      references: [users.id],
    }),
    evaluatees: many(evaluatees),
  })
);

export const evaluatees = pgTable("evaluatee", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  isTeamLeader: boolean("isTeamLeader").notNull().default(false),
  evaluationSlotId: text("evaluationSlotId")
    .references(() => evaluationSlots.id)
    .notNull(),
  comment: text("comment").notNull().default(""),
});

export const evaluateesRelations = relations(evaluatees, ({ one }) => ({
  user: one(users, {
    fields: [evaluatees.userId],
    references: [users.id],
  }),
  evaluationSlot: one(evaluationSlots, {
    fields: [evaluatees.evaluationSlotId],
    references: [evaluationSlots.id],
  }),
}));
