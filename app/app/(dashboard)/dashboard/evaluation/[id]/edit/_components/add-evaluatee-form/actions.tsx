"use server";

import { auth } from "@/auth";
import {
  accounts,
  evaluatees,
  evaluationSlots,
  users,
} from "@/drizzle/schemas";
import { FtApi } from "@/lib/42";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface IAddEvaluatee {
  evaluationSlotId: string;
  evaluateeLogin: string;
}

export async function addEvaluatee(
  p: IAddEvaluatee
): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  const slot = await db.query.evaluationSlots.findFirst({
    where: and(
      eq(evaluationSlots.id, p.evaluationSlotId),
      eq(evaluationSlots.evaluatorUserId, session.user!.id!)
    ),
  });
  if (!slot) {
    return { data: null, error: "Unauthorized" };
  }
  const ftApi = new FtApi();
  let user: any = {};
  try {
    user = await ftApi.getUserById({ id: p.evaluateeLogin });
  } catch (e) {
    return { data: null, error: "User not found" };
  }
  const user_id = user.id.toString();
  let account = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, user_id),
  });
  if (!account) {
    const db_user = await db
      .insert(users)
      .values({
        id: randomUUID(),
        name: user.usual_full_name,
        email: user.email,
      })
      .returning();
    account = (
      await db
        .insert(accounts)
        .values({
          userId: db_user[0].id,
          type: "oauth",
          provider: "42-school",
          providerAccountId: user.id.toString(),
        })
        .onConflictDoNothing()
        .returning()
    )[0];
  }
  // check if evaluatee is already in the slot
  const evaluatee = await db.query.evaluatees.findFirst({
    where: and(
      eq(evaluatees.userId, account.userId),
      eq(evaluatees.evaluationSlotId, p.evaluationSlotId)
    ),
  });
  if (evaluatee) {
    return { data: null, error: "Evaluatee already in slot" };
  }
  await db
    .insert(evaluatees)
    .values({
      userId: account!.userId!,
      evaluationSlotId: p.evaluationSlotId,
      comment: "",
    })
    .onConflictDoNothing()
    .returning();
  revalidatePath(`/dashboard/evaluation/${p.evaluationSlotId}/edit`);
  return { data: true, error: null };
}
