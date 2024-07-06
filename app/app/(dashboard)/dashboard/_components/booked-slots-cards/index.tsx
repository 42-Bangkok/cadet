import { auth } from "@/auth";
import { evaluatees, evaluationSlots, users } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, eq, gte } from "drizzle-orm";
import { BookedSlotCard } from "./book-slot-card";
import { alias } from "drizzle-orm/pg-core";

export const BookedSlotsCards = async () => {
  const session = await auth();
  const evaluator = alias(users, "evaluator");
  const nowPlus30 = new Date();
  nowPlus30.setMinutes(nowPlus30.getMinutes() + 30);
  const qs = await db
    .select()
    .from(evaluatees)
    .where(eq(evaluatees.userId, session!.user!.id!))
    .leftJoin(
      evaluationSlots,
      and(
        eq(evaluationSlots.id, evaluatees.evaluationSlotId),
        gte(evaluationSlots.startDateTime, nowPlus30)
      )
    )
    .innerJoin(evaluator, eq(evaluator.id, evaluationSlots.evaluatorUserId));
  if (qs.length === 0) {
    return <div>{"No booked slot(s)..."}</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {qs.map((slot) => (
        // TODO: Aggregate evaluatees
        // @ts-ignore
        <BookedSlotCard key={slot.evaluationSlot!.id} {...slot} />
      ))}
    </div>
  );
};
