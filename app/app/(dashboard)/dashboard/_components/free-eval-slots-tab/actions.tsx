"use server";

import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { eq, and, isNull, gt, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface IBookSlot {
  startDateTime: Date;
}

/**
 * Book an available slot
 * - only one unevaluated slot can be booked at a time
 */
export async function BookSlot(p: IBookSlot): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  const slots = await db.query.evaluationSlots.findMany({
    where: and(
      eq(evaluationSlots.teamLeaderUserId, session!.user!.id!),
      eq(evaluationSlots.isEvaluated, false)
    ),
  });
  if (slots.length > 0) {
    return { data: null, error: "You already have a booked, unevaluated slot" };
  }
  const slot = await db.query.evaluationSlots.findFirst({
    where: and(
      eq(evaluationSlots.startDateTime, p.startDateTime),
      isNull(evaluationSlots.teamLeaderUserId)
    ),
  });
  if (!slot) {
    return { data: null, error: "Slot is already booked" };
  }
  await db
    .update(evaluationSlots)
    .set({
      teamLeaderUserId: session!.user!.id!,
    })
    .where(eq(evaluationSlots.id, slot.id!));

  revalidatePath("/dashboard");
  return { data: true, error: null };
}
