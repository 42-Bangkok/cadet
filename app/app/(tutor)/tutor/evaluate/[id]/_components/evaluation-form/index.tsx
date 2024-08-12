import { Suspense } from "react";
import { EvalForm } from "./eval-form";
import { IntraAvatar } from "./intra-avatar";
import { TypographyH2 } from "@/components/typographies";
import { Card } from "@/components/ui/card";
import { getEvaluationSlot } from "@/lib/db/evaluations";

type TEvaluationForm = NonNullable<
  Awaited<ReturnType<typeof getEvaluationSlot>>
>;

export const EvaluationForm = (p: TEvaluationForm) => {
  const timeEnds = new Date(p.startDateTime);
  timeEnds.setHours(timeEnds.getHours() + 1);
  const evalFormProps = {
    evaluatees: p.evaluatees.map((evaluatee) => ({
      name: evaluatee.user.name!,
      isTeamLeader: evaluatee.isTeamLeader,
      evaluateeId: evaluatee.id,
      comment: evaluatee.comment,
    })),
  };
  const providerAccountIds = p.evaluatees.map(
    (evaluatee) => evaluatee.user.accounts[0].providerAccountId
  );
  const timeString = `
  ${p.startDateTime.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })} 
  ~ 
  ${timeEnds.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}
  `;
  return (
    <div>
      <p>{timeString}</p>
      <TypographyH2>Evaluatees</TypographyH2>
      <div className="flex gap-2 p-4">
        <div className="flex flex-col gap-6">
          {providerAccountIds.map((id) => (
            <Card
              key={id}
              className="rounded-l-full flex h-32 items-center justify-center p-4 pr-2"
            >
              <Suspense fallback={<IntraAvatar.Skeleton />}>
                <IntraAvatar login={id} />
              </Suspense>
            </Card>
          ))}
        </div>
        <EvalForm {...evalFormProps} />
      </div>

      {/* <pre>{JSON.stringify(p, null, 2)}</pre> */}
    </div>
  );
};
