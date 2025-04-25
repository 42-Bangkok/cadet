"use server";

import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { and, eq } from "drizzle-orm";

interface ISubmitProject {
  project: string;
  evaluationSlotId: string;
}

export async function submitProject(
  p: ISubmitProject,
): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  const slot = await db.query.evaluationSlots.findFirst({
    where: and(
      eq(evaluationSlots.id, p.evaluationSlotId),
      eq(evaluationSlots.evaluatorUserId, session.user!.id!),
    ),
  });
  if (!slot) {
    throw new Error("Slot not found");
  }
  await db
    .update(evaluationSlots)
    .set({ project: p.project })
    .where(eq(evaluationSlots.id, p.evaluationSlotId));

  return { data: true, error: null };
}
