import { getOrCreateProfile } from "@/lib/users/core";
import { db } from "@/lib/db/clients";
import { accounts } from "@/drizzle/schemas";
import { and, eq } from "drizzle-orm";
import { FtApi } from "@/lib/42";
import { notFound } from "next/navigation";
import { UserProfile } from "@/components/users/user-profile";

export default async function Page({ params }: { params: { id: string } }) {
  // id is the 42-school id
  const userId = (await params).id;
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, userId),
  });
  if (!account) return notFound();
  const profile = await getOrCreateProfile({ id: account.userId });
  const api = new FtApi();
  const user = await api.getUserById({ id: userId });
  return (
    <div>
      <UserProfile user={user} profile={profile!} />
    </div>
  );
}
