import { auth } from "@/auth";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, eq, is } from "drizzle-orm";
import { AddEvaluateeForm } from "./_components/add-evaluatee-form";
import { IntraAvatar } from "./_components/intra-avatar";
import { TypographyH1 } from "@/components/typographies";
import { BackBtn } from "@/components/back-btn";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const slot = await db.query.evaluationSlots.findFirst({
    where: and(
      eq(evaluationSlots.id, params.id),
      eq(evaluationSlots.evaluatorUserId, session!.user!.id!)
    ),
  });
  const qEvaluatee = await db.query.evaluatees.findMany({
    where: eq(evaluatees.evaluationSlotId, params.id),
    with: {
      user: {
        with: {
          accounts: true,
        },
      },
    },
  });
  const avatars = qEvaluatee.map((e) => ({
    evaluateeId: e.id,
    isTeamLeader: e.isTeamLeader,
    login: e.user.accounts[0].providerAccountId,
  }));
  if (!slot) {
    return <div>Not found</div>;
  }
  if (slot.startDateTime.getTime() < Date.now()) {
    return <div>Not editable</div>;
  }
  return (
    <main className="flex flex-col gap-4">
      <BackBtn />
      <TypographyH1>Edit Evaluation Slot</TypographyH1>
      {/* TODO: remove this */}
      {/* <pre>{JSON.stringify(slot, null, 2)}</pre>
      <pre>{JSON.stringify(qEvaluatee, null, 2)}</pre> */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          {avatars.map((d) => (
            <IntraAvatar key={d.login} {...d} />
          ))}
        </div>
        <AddEvaluateeForm evaluationSlotId={params.id} />
      </div>
    </main>
  );
}
