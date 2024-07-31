"use server";

import { evaluatees } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface ISubmitEvaluation {
  evaluatees: {
    evaluateeId: string;
    comment: string;
  }[];
}

export async function submitEvaluation(
  p: ISubmitEvaluation
): Promise<SAResponse<boolean>> {
  for (const evaluatee of p.evaluatees) {
    await db
      .update(evaluatees)
      .set({ comment: evaluatee.comment })
      .where(eq(evaluatees.id, evaluatee.evaluateeId));
  }
  const evaluatee = await db.query.evaluatees.findFirst({
    where: eq(evaluatees.id, p.evaluatees[0].evaluateeId),
  });
  revalidatePath(`/tutor/evaluate/${evaluatee!.evaluationSlotId}`);
  return { data: true, error: null };
}
