import { db } from "@/lib/db/clients";
import { evaluationSlots, accounts } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";

export function transformEvaluations(
  dbEvaluations: Awaited<ReturnType<typeof getAllEvaluations>>,
) {
  return dbEvaluations.flatMap((slot) =>
    slot.evaluatees.map((evaluatee) => ({
      id: evaluatee.id,
      student: evaluatee.user.name || "Unknown",
      evaluator: slot.evaluator ? slot.evaluator.name : "Unknown",
      project: slot.project || "Unknown",
      date: slot.startDateTime.toISOString(),
      comment: evaluatee.comment,
    })),
  );
}

export async function getAllEvaluations({
  evaluationSlotId,
}: {
  evaluationSlotId: string;
}) {
  return await db.query.evaluationSlots.findMany({
    where: eq(evaluationSlots.id, evaluationSlotId),
    with: {
      evaluator: true,
      evaluatees: {
        columns: {
          id: true,
          comment: true,
          isTeamLeader: true,
        },
        with: {
          user: {
            with: {
              accounts: {
                where: eq(accounts.provider, "42-school"),
              },
            },
          },
        },
      },
    },
  });
}
