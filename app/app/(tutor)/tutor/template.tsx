import { auth } from "@/auth";
import { hasAnyRole } from "@/lib/rbac/core";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return <div>Unauthorized</div>;
  const isTutor = await hasAnyRole({
    email: session.user!.email as string,
    roles: ["staff"],
  });
  if (!isTutor)
    return <div>Forbidden you need tutor role to access this page.</div>;

  return <>{children}</>;
}
