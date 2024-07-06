import { BackBtn } from "@/components/back-btn";
import { accounts, evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EvaluationForm } from "./_components/evaluation-form";
import { TypographyH1, TypographyLead } from "@/components/typographies";

export default async function Page({ params }: { params: { id: string } }) {
  const slot = await getEvaluationSlot({ id: params.id });
  if (!slot) {
    return notFound();
  }
  if (slot.evaluatees.length === 0) {
    return (
      <div>
        <BackBtn />
        <p>No evaluatee...</p>
      </div>
    );
  }
  return (
    <div>
      <TypographyH1>Evaluation</TypographyH1>
      <TypographyLead className="text-md">
        Evaluate the following cadets. Comments can be saved as many times as
        you&apos;d need, but only during the evaluation period.
      </TypographyLead>
      <EvaluationForm {...slot} />
    </div>
  );
}

export async function getEvaluationSlot({ id }: { id: string }) {
  return await db.query.evaluationSlots.findFirst({
    where: eq(evaluationSlots.id, id),
    with: {
      evaluatees: {
        columns: {
          id: true,
          comment: true,
          isTeamLeader: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              email: true,
            },
            with: {
              accounts: {
                where: eq(accounts.provider, "42-school"),
                columns: {
                  providerAccountId: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
