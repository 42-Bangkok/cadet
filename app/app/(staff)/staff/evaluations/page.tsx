import { StaffEvaluations } from "./_components/staff-evaluations";
import { getAllEvaluations, transformEvaluations } from "./utils";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    evaluationSlotId?: string;
  };
}) {
  const dbEvaluations = await getAllEvaluations({
    evaluationSlotId: searchParams?.evaluationSlotId || "",
  });
  const evaluationsData = transformEvaluations(dbEvaluations);

  return <StaffEvaluations evaluations={evaluationsData} />;
}
