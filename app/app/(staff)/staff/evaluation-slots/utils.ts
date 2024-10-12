import { db } from "@/lib/db/clients";
import { evaluationSlots } from "@/drizzle/schemas";
import { and, desc, isNotNull } from "drizzle-orm";

type DbEvaluationSlot = {
  id: string;
  startDateTime: Date;
  project: string | null;
  isEvaluated: boolean;
};

type EvaluationSlot = {
  id: string;
  project: string;
  date: string;
  status: string;
};

export async function getEvaluatedSlots(): Promise<DbEvaluationSlot[]> {
  return await db.query.evaluationSlots.findMany({
    where: and(
      isNotNull(evaluationSlots.isEvaluated),
      evaluationSlots.isEvaluated
    ),
    columns: {
      id: true,
      startDateTime: true,
      project: true,
      isEvaluated: true,
    },
    orderBy: desc(evaluationSlots.startDateTime),
  });
}

export function transformEvaluationSlots(
  dbSlots: DbEvaluationSlot[]
): EvaluationSlot[] {
  return dbSlots.map((slot) => ({
    id: slot.id,
    project: slot.project || "Unknown",
    date: slot.startDateTime.toISOString(),
    status: slot.isEvaluated ? "Completed" : "Pending",
  }));
}
