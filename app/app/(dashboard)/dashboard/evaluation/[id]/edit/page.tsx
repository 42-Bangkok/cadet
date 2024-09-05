import { auth } from "@/auth";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { and, eq } from "drizzle-orm";
import { AddEvaluateeForm } from "./_components/add-evaluatee-form";
import { IntraAvatar } from "./_components/intra-avatar";
import { TypographyH1 } from "@/components/typographies";
import { BackBtn } from "@/components/back-btn";

async function getSlot({
  id,
  evaluatorUserId,
}: {
  id: string;
  evaluatorUserId: string;
}) {
  return await db.query.evaluationSlots.findFirst({
    where: and(
      eq(evaluationSlots.id, id),
      eq(evaluationSlots.evaluatorUserId, evaluatorUserId)
    ),
  });
}

async function getEvaluatees({
  evaluationSlotId,
}: {
  evaluationSlotId: string;
}) {
  return await db.query.evaluatees.findMany({
    where: eq(evaluatees.evaluationSlotId, evaluationSlotId),
    with: {
      user: {
        with: {
          accounts: true,
        },
      },
    },
  });
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const slot = await getSlot({
    id: params.id,
    evaluatorUserId: session!.user!.id!,
  });
  const evaluatees = await getEvaluatees({ evaluationSlotId: params.id });
  const avatars = evaluatees.map((e) => ({
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
