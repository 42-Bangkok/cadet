import { accounts, evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { eq } from "drizzle-orm";

/**
 * Get the evaluation slot for a given id.
 * @param id The id of the evaluation slot.
 * @returns The evaluation slot.
 */
export async function getEvaluationSlot({ id }: { id: string }) {
  return await db.query.evaluationSlots.findFirst({
    where: eq(evaluationSlots.id, id),
    with: {
      evaluatees: {
        columns: {
          id: true,
          comment: true,
          isTeamLeader: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              email: true,
            },
            with: {
              accounts: {
                where: eq(accounts.provider, "42-school"),
                columns: {
                  providerAccountId: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
