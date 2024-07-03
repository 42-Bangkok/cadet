import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, asc, gte, isNull } from "drizzle-orm";
import { SlotsTable } from "./slots-table";

export const FreeEvalSlotsTab = async () => {
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
    where: and(
      isNull(evaluationSlots.teamLeaderUserId),
      gte(evaluationSlots.startDateTime, tomorrow)
    ),
    columns: {
      startDateTime: true,
    },
    orderBy: [asc(evaluationSlots.startDateTime)],
  });
  return [...new Set(evalSlots)];
}
