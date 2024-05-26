"use server";

import { roleAssignQueues, users, usersToRoles } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addRole({
  email,
  roleId,
}: {
  email: string;
  roleId: string;
}): Promise<SAResponse<string>> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    try {
      await db
        .insert(roleAssignQueues)
        .values({ email: email, roleId: roleId });
      return {
        data: "Role added, user will receive it when they first log in.",
        error: null,
      };
    } catch (e) {
      return {
        data: null,
        error: "User already in queue to receive that role.",
      };
    }
  }
  try {
    await db.insert(usersToRoles).values({ userId: user.id, roleId: roleId });
  } catch (e) {
    return { data: null, error: "User already has that role." };
  }
  revalidatePath("/staff/iam");
  return { data: "Success, role added.", error: null };
}
