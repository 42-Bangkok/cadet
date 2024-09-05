"use server";

import { auth } from "@/auth";
import { roles, usersToRoles } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { hasAnyRole } from "@/lib/rbac/core";
import { SAResponse } from "@/types/sa-response";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function removeRole({
  userId,
  roleId,
}: {
  userId: string;
  roleId: string;
}): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    {
      throw new Error("Unauthorized");
    }
  }
  if (
    !hasAnyRole({ email: session!.user!.email as string, roles: ["staff"] })
  ) {
    throw new Error("Forbidden");
  }
  const staffRole = await db.query.roles.findFirst({
    where: eq(roles.name, "staff"),
  });
  if (session.user!.id === userId && roleId === staffRole!.id) {
    return {
      data: null,
      error:
        "Prof Oak: It is not the right place, and time to remove staff role from yourself!",
    };
  }
  await db
    .delete(usersToRoles)
    .where(
      and(eq(usersToRoles.userId, userId), eq(usersToRoles.roleId, roleId)),
    );
  revalidatePath("/staff/iam");
  return { data: true, error: null };
}
