import { users } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { eq } from "drizzle-orm";

/**
 * Checks if a user has any of the specified roles.
 * @param {Object} options - The options object.
 * @param {string} options.email - The email of the user.
 * @param {string[]} options.roles - The roles to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the user has any of the specified roles.
 */
export async function hasAnyRole({
  email,
  roles,
}: {
  email: string;
  roles: string[];
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    with: {
      usersToRoles: {
        columns: {},
        with: {
          role: true,
        },
      },
    },
  });
  if (!user) return false;
  const userRoles = user.usersToRoles.map((r) => r.role.name);

  return roles.some((r) => userRoles.includes(r));
}
