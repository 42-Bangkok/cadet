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
  const user = await db.query.users.findFirst({
    where: eq(users.email, session!.user!.email as string),
    with: {
      usersToRoles: {
        columns: {},
        with: {
          role: true,
        },
      },
    },
  });
  return <>{children}</>;
}
