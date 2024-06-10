import { auth } from "@/auth";
import { TypographyH1 } from "@/components/typographies";
import { getOrCreateProfile } from "@/lib/users/core";
import { Session } from "next-auth";

export default async function Page() {
  const session = (await auth()) as Session;
  const profile = await getOrCreateProfile({ id: session.user!.id as string });
  return (
    <main>
      <TypographyH1>Tutor&apos;s Dashboard</TypographyH1>
      <p>Welcome, {session.user!.name}</p>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </main>
  );
}
