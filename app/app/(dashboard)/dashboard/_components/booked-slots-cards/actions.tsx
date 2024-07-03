"use server";

import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
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
  const slot = await db.query.evaluationSlots.findFirst({
    where: and(
      eq(evaluationSlots.id, id),
      eq(evaluationSlots.teamLeaderUserId, session!.user!.id!)
    ),
  });
  if (!slot) {
    throw new Error("Slot not found");
  }
  if (slot.startDateTime.getTime() - Date.now() < 1000 * 60 * 30) {
    return { data: null, error: "Slot cannot be cancelled after 30 minutes" };
  }
  await db
    .update(evaluationSlots)
    .set({
      teamLeaderUserId: null,
    })
    .where(eq(evaluationSlots.id, id));
  revalidatePath("/dashboard");
  return { data: true, error: null };
}
