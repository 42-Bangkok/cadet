"use server";

import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { hasAnyRole } from "@/lib/rbac/core";
import { SAResponse } from "@/types/sa-response";
import { revalidatePath } from "next/cache";

interface ICreateEvaluationSlots {
  dates: Date[];
  startTime: string;
  endTime: string;
}

/**
 * Creates evaluation slots for a tutor.
 * @param {ICreateEvaluationSlots} p - The parameters object.
 * @param {Date[]} p.dates - The dates of the slots.
 * @param {string} p.startTime - The start time of the slots.
 * @param {string} p.endTime - The end time of the slots.
 * @returns {Promise<SAResponse<Number>>} - A promise that resolves to the number of slots created.
 */
export async function createEvaluationSlots(
  p: ICreateEvaluationSlots,
): Promise<SAResponse<Number>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthenticated");
  }
  if (!(await hasAnyRole({ email: session.user?.email!, roles: ["tutor"] }))) {
    throw new Error("Unauthorized");
  }
  if (p.startTime.split(":")[1] != "00" || p.endTime.split(":")[1] != "00") {
    throw new Error(
      "Congrats on trying to break the system! Contact Guang for some Cookies",
    );
  }
  const slots = [];
  for (const date of p.dates) {
    const start = new Date(date);
    const startHour = Number(p.startTime.split(":")[0]);
    const endHour = Number(p.endTime.split(":")[0]);
    const range = endHour - startHour;
    for (let i = 0; i < range; i++) {
      const startDateTime = new Date(start);
      startDateTime.setHours(startHour + i, 0, 0, 0);
      slots.push({
        evaluatorUserId: session.user!.id!,
        startDateTime: startDateTime,
      });
    }
  }
  if (slots.length === 0) {
    return { data: null, error: "No slot to create" };
  }
  if (slots.length > 100) {
    return { data: null, error: "Too many slots to create, slow down!" };
  }
  const res = await db
    .insert(evaluationSlots)
    .values(slots)
    .onConflictDoNothing()
    .returning();
  revalidatePath("/tutor");
  return { data: res.length, error: null };
}
