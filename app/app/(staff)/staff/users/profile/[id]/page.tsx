import { getOrCreateProfile } from "@/lib/users/core";
import { db } from "@/lib/db/clients";
import { accounts } from "@/drizzle/schemas";
import { and, eq } from "drizzle-orm";
import { FtApi } from "@/lib/42";
import { notFound } from "next/navigation";
import { UserProfile } from "@/app/(dashboard)/dashboard/profile/_components/user-profile";

export default async function Page({ params }: { params: { id: string } }) {
  // id is the 42-school id
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, params.id),
  });
  if (!account) return notFound();
  const profile = await getOrCreateProfile({ id: account.userId });
  const api = new FtApi();
  const user = await api.getUserById({ id: params.id });
  return (
    <div>
      <UserProfile user={user} profile={profile!} />
    </div>
  );
}
