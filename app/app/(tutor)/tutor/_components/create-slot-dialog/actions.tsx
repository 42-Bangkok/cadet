"use server";

import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { hasAnyRole } from "@/lib/rbac/core";
import { SAResponse } from "@/types/sa-response";

interface ICreateEvaluationSlots {
  date: Date;
  startTime: string;
  endTime: string;
}

/**
 * Creates evaluation slots for a tutor.
 * @param {ICreateEvaluationSlots} p - The parameters object.
 * @param {Date} p.date - The date of the slots.
 * @param {string} p.startTime - The start time of the slots.
 * @param {string} p.endTime - The end time of the slots.
 * @returns {Promise<SAResponse<Number>>} - A promise that resolves to the number of slots created.
 */
export async function createEvaluationSlots(
  p: ICreateEvaluationSlots
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
      "Congrats on trying to break the system! Contact Guang for some Cookies"
    );
  }
  const start = new Date(p.date);
  const startHour = Number(p.startTime.split(":")[0]);
  const endHour = Number(p.endTime.split(":")[0]);
  const range = endHour - startHour;
  const slots = [];
  for (let i = 0; i < range; i++) {
    const startDateTime = new Date(start);
    startDateTime.setHours(startHour + i, 0, 0, 0);
    slots.push({
      evaluatorUserId: session.user!.id!,
      startDateTime: startDateTime,
    });
  }
  const res = await db
    .insert(evaluationSlots)
    .values(slots)
    .onConflictDoNothing()
    .returning();
  return { data: res.length, error: null };
}
