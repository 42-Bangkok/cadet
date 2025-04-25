import { UserProfile } from "@/components/users/user-profile";
import { accounts } from "@/drizzle/schemas";
import { FtApi } from "@/lib/42";
import { db } from "@/lib/db/clients";
import { getOrCreateProfile } from "@/lib/users/core";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // id is the 42-school id
  const { id: userId } = await params;
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
