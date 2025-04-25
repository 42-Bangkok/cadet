"use server";

import { auth } from "@/auth";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface IBookSlot {
  startDateTime: Date;
}

interface IBookSlotResponse {
  evaluationSlotId: string;
}

/**
 * Book an available slot
 * - only one unevaluated slot can be booked at a time
 */
export async function BookSlot(
  p: IBookSlot,
): Promise<SAResponse<IBookSlotResponse>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  // TODO: optimize using select
  const qsEvaluatee = await db.query.evaluatees.findMany({
    where: and(eq(evaluatees.userId, session!.user!.id!)),
    with: {
      evaluationSlot: true,
    },
  });
  if (
    qsEvaluatee.length > 0 &&
    qsEvaluatee.map((e) => e.evaluationSlot!.isEvaluated).includes(false)
  ) {
    return { data: null, error: "You already have a booked, unevaluated slot" };
  }
  // ENDOF TODO: optimize using select
  const slot = await db.query.evaluationSlots.findFirst({
    where: and(eq(evaluationSlots.startDateTime, p.startDateTime)),
    with: {
      evaluatees: true,
    },
  });
  if (!slot) {
    return { data: null, error: "Slot not found" };
  }
  if (slot.evaluatees.length > 0) {
    return { data: null, error: "Slot is already booked" };
  }
  await db.insert(evaluatees).values({
    userId: session!.user!.id!,
    evaluationSlotId: slot.id,
    isTeamLeader: true,
  });
  revalidatePath("/dashboard");
  return { data: { evaluationSlotId: slot.id }, error: null };
}
