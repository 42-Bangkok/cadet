import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, eq, gte } from "drizzle-orm";
import { BookedSlotCard } from "./book-slot-card";

export const BookedSlotsCards = async () => {
  const session = await auth();
  const bookedSlots = await db.query.evaluationSlots.findMany({
    where: and(
      eq(evaluationSlots.teamLeaderUserId, session!.user!.id!),
      gte(evaluationSlots.startDateTime, new Date())
    ),
    with: {
      evaluator: true,
    },
  });
  if (bookedSlots.length === 0) {
    return <div>{"No booked slots"}</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {bookedSlots.map((slot) => (
        <BookedSlotCard key={slot.id} {...slot} />
      ))}
    </div>
  );
};
