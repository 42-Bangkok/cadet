import { auth } from "@/auth";
import { users } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { eq } from "drizzle-orm";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return <div>Unauthorized</div>;

  async function hasAnyRole({
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

  console.log(
    "hasAnyRole",
    await hasAnyRole({ email: session.user!.email as string, roles: ["staff"] })
  );

  return <>{children}</>;
}
