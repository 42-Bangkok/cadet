import { auth } from "@/auth";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return <div>Unauthorized</div>;
  return <>{children}</>;
}
