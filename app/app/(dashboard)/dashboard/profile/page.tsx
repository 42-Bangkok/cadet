import { auth } from "@/auth";
import { accounts, profiles } from "@/drizzle/schemas";
import { FtApi } from "@/lib/42";
import { db } from "@/lib/db/clients";
import { and, eq } from "drizzle-orm";
import { UserProfile } from "../../../../components/users/user-profile";
import { getOrCreateProfile } from "@/lib/users/core";

export default async function Page() {
  const session = await auth();
  const profile = await getOrCreateProfile({ id: session!.user!.id! });
  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, session!.user!.id!),
      eq(accounts.provider, "42-school")
    ),
  });
  const api = new FtApi();
  const user = await api.getUserById({ id: account!.providerAccountId });
  return (
    <div>
      <UserProfile user={user} profile={profile!} />
    </div>
  );
}
