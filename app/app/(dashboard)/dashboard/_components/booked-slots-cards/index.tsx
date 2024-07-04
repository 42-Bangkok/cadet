import { auth } from "@/auth";
import { evaluatees, evaluationSlots, users } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, eq, gte } from "drizzle-orm";
import { BookedSlotCard } from "./book-slot-card";
import { alias } from "drizzle-orm/pg-core";

export const BookedSlotsCards = async () => {
  const session = await auth();
  const evaluator = alias(users, "evaluator");

  const bookedSlots = await db
    .select()
    .from(evaluatees)
    .where(eq(evaluatees.userId, session!.user!.id!))
    .leftJoin(
      evaluationSlots,
      and(
        eq(evaluationSlots.id, evaluatees.evaluationSlotId),
        gte(evaluationSlots.startDateTime, new Date())
      )
    )
    .leftJoin(evaluator, eq(evaluator.id, evaluationSlots.evaluatorUserId));
  if (bookedSlots.length === 0) {
    return <div>{"No booked slots"}</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {bookedSlots.map((slot) => (
        <BookedSlotCard key={slot.evaluationSlot.id} {...slot} />
      ))}
    </div>
  );
};
