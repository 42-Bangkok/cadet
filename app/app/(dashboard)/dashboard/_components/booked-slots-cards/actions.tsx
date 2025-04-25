"use server";

import { auth } from "@/auth";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function cancelBookedSlot({
  id,
}: {
  id: string;
}): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  const evaluatee = await db.query.evaluatees.findFirst({
    where: and(
      eq(evaluatees.userId, session!.user!.id!),
      eq(evaluatees.evaluationSlotId, id),
    ),
    with: {
      evaluationSlot: true,
    },
  });
  if (!evaluatee) {
    throw new Error("Slot not found");
  }
  if (evaluatee.isTeamLeader != true) {
    return { data: null, error: "Only team leaders can cancel slots" };
  }
  if (
    evaluatee.evaluationSlot.startDateTime.getTime() - Date.now() <
    1000 * 60 * 30
  ) {
    return { data: null, error: "Slot cannot be cancelled after 30 minutes" };
  }
  await db.delete(evaluatees).where(eq(evaluatees.evaluationSlotId, id));
  revalidatePath("/dashboard");
  return { data: true, error: null };
}
