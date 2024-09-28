import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, asc, gte } from "drizzle-orm";
import { SlotsTable } from "./slots-table";

export const FreeEvalSlotsTable = async () => {
  const evalSlots = await getFreeEvalSlots();
  return <SlotsTable data={evalSlots} />;
};

/**
 * Get all free evaluation slots. Duplicate slots from different tutors are removed.
 */
async function getFreeEvalSlots() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const evalSlots = await db.query.evaluationSlots.findMany({
    where: and(gte(evaluationSlots.startDateTime, tomorrow)),
    columns: {
      startDateTime: true,
    },
    with: {
      evaluatees: true,
    },
    orderBy: [asc(evaluationSlots.startDateTime)],
  });
  const freeSlots = evalSlots.filter((slot) => slot.evaluatees.length === 0);
  let res = freeSlots.map((slot) => {
    return { startDateTime: slot.startDateTime };
  });
  return [...new Set(res)];
}
