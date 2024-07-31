"use server";

import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Delete a slot
 * @param slot's id
 */
export async function deleteSlot({
  id,
}: {
  id: string;
}): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenthicated");
  }
  const slot = await db.query.evaluationSlots.findFirst({
    where: eq(evaluationSlots.id, id),
  });
  if (!slot) {
    return { data: null, error: "Not found" };
  }
  if (slot.isEvaluated === true) {
    return { data: null, error: "Cannot delete evaluated slot" };
  }
  const res = await db
    .delete(evaluationSlots)
    .where(
      and(
        eq(evaluationSlots.evaluatorUserId, session.user!.id!),
        eq(evaluationSlots.id, id)
      )
    )
    .returning();

  revalidatePath("/tutor");
  return { data: true, error: null };
}
