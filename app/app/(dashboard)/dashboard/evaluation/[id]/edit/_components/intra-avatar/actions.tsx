"use server";

import { auth } from "@/auth";
import { evaluatees } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface IRemoveEvaluatee {
  evaluateeId: string;
}

export async function removeEvaluatee(
  p: IRemoveEvaluatee,
): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  const evaluatee = await db.query.evaluatees.findFirst({
    where: eq(evaluatees.id, p.evaluateeId),
  });
  if (!evaluatee) {
    return { data: null, error: "Evaluatee not found" };
  }
  await db.delete(evaluatees).where(eq(evaluatees.id, p.evaluateeId));

  revalidatePath(`/dashboard/evaluation/${evaluatee.evaluationSlotId}/edit`);

  return { data: true, error: null };
}
