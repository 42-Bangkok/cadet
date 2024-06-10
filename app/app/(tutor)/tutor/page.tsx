import { auth } from "@/auth";
import { TypographyH1 } from "@/components/typographies";
import { getOrCreateProfile } from "@/lib/users/core";
import { Session } from "next-auth";
import { ForeignerForm } from "./_components/foreigner-form";

export default async function Page() {
  const session = (await auth()) as Session;
  const profile = await getOrCreateProfile({ id: session.user!.id as string });
  return (
    <main className="flex flex-col gap-4">
      <TypographyH1>Tutor&apos;s Dashboard</TypographyH1>
      <p>Welcome, {session.user!.name}</p>
      <ForeignerForm id={profile.id} foreigner={profile.foreigner} />
    </main>
  );
}
