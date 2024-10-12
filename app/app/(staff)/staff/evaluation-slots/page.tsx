import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db/clients";
import { evaluationSlots, accounts, evaluatees } from "@/drizzle/schemas";
import { and, gte, isNotNull } from "drizzle-orm";
import Link from "next/link";
import { BackBtn } from "@/components/back-btn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DbEvaluationSlot = {
  id: string;
  startDateTime: Date;
  project: string | null;
  isEvaluated: boolean;
};

type EvaluationSlot = {
  id: string;
  project: string;
  date: string;
  status: string;
};

async function getEvaluatedSlots(): Promise<DbEvaluationSlot[]> {
  return await db.query.evaluationSlots.findMany({
    where: and(
      isNotNull(evaluationSlots.isEvaluated),
      evaluationSlots.isEvaluated
    ),
    columns: {
      id: true,
      startDateTime: true,
      project: true,
      isEvaluated: true,
    },
  });
}

function transformEvaluationSlots(
  dbSlots: DbEvaluationSlot[]
): EvaluationSlot[] {
  return dbSlots.map((slot) => ({
    id: slot.id,
    project: slot.project || "Unknown",
    date: slot.startDateTime.toISOString(),
    status: slot.isEvaluated ? "Completed" : "Pending",
  }));
}

export default async function EvaluationSlotsPage() {
  const dbEvaluationSlots = await getEvaluatedSlots();
  const evaluationSlots = transformEvaluationSlots(dbEvaluationSlots);

  return (
    <div className="container mx-auto py-10">
      <BackBtn />
      <h1 className="text-3xl font-bold mb-6">Evaluated Slots</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluationSlots.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell>{slot.project}</TableCell>
              <TableCell>{new Date(slot.date).toLocaleString()}</TableCell>
              <TableCell>{slot.status}</TableCell>
              <TableCell>
                <Link
                  href={`/staff/evaluations?evaluationSlotId=${slot.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
