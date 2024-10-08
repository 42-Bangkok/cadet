import { auth } from "@/auth";
import { evaluationSlots } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { asc, eq } from "drizzle-orm";
import { SlotsTable } from "./slots-table";
import { CreateSlotDialog } from "../create-slot-dialog";
import { TypographyH2 } from "@/components/typographies";

export const SlotsDataTable = async () => {
  const session = await auth();
  const slots = await db.query.evaluationSlots.findMany({
    where: eq(evaluationSlots.evaluatorUserId, session!.user!.id!),
    with: {
      evaluatees: true,
    },
    orderBy: [asc(evaluationSlots.startDateTime)],
  });
  const slotsWithEvaluatees = slots.filter((slot) => {
    return slot.evaluatees.length > 0;
  });
  const slotsWithoutEvaluatees = slots.filter((slot) => {
    return slot.evaluatees.length === 0;
  });
  const sortedSlots = [...slotsWithEvaluatees, ...slotsWithoutEvaluatees];
  return (
    <div>
      <div className="flex justify-between pb-2">
        <TypographyH2>Active Evaluation slots</TypographyH2>
        <CreateSlotDialog />
      </div>
      <SlotsTable slots={sortedSlots} />
    </div>
  );
};
