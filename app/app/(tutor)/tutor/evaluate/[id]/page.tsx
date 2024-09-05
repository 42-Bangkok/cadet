import { BackBtn } from "@/components/back-btn";

import { notFound } from "next/navigation";
import { EvaluationForm } from "./_components/evaluation-form";
import { TypographyH1, TypographyLead } from "@/components/typographies";
import { getEvaluationSlot } from "@/lib/db/evaluations";

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
    <main>
      <BackBtn />
      <TypographyH1>Evaluation</TypographyH1>
      <TypographyLead className="text-md">
        Evaluate the following cadets. Comments can be saved as many times as
        you&apos;d need, but only after the evaluation period stated, and 30
        minutes after.
      </TypographyLead>
      <EvaluationForm {...slot} />
    </main>
  );
}
