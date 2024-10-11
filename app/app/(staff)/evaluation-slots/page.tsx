import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db/clients";
import { evaluationSlots, accounts } from "@/drizzle/schemas";
import { and, isNotNull } from "drizzle-orm";
import Link from "next/link";

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
  try {
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
  } catch (error) {
    console.error("Error fetching evaluation slots:", error);
    throw new Error("Failed to fetch evaluation slots");
  }
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
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      redirect("/");
    }

    const dbEvaluationSlots = await getEvaluatedSlots();
    const evaluationSlots = transformEvaluationSlots(dbEvaluationSlots);

    return (
      <div>
        <h1>Evaluated Slots</h1>
        <ul>
          {evaluationSlots.map((slot) => (
            <li key={slot.id}>
              <Link href={`/evaluations?evaluationSlotId=${slot.id}`}>
                {slot.project} - {new Date(slot.date).toLocaleString()} -{" "}
                {slot.status}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error in EvaluationSlotsPage:", error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
