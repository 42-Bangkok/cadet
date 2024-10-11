import { redirect } from "next/navigation";
import { StaffEvaluations } from "./_components/staff-evaluations";
import { auth } from "@/auth";
import { db } from "@/lib/db/clients";
import { evaluationSlots, accounts } from "@/drizzle/schemas";
import { eq } from "drizzle-orm";

type DbEvaluation = {
  id: string;
  startDateTime: Date;
  project: string | null;
  isEvaluated: boolean;
  evaluatees: {
    id: string;
    user: {
      name: string | null;
    };
  }[];
};

type Evaluation = {
  id: string;
  student: string;
  evaluator: string;
  project: string;
  date: string;
  status: string;
};

async function getAllEvaluations({
  evaluationSlotId,
}: {
  evaluationSlotId: string;
}): Promise<DbEvaluation[]> {
  try {
    return await db.query.evaluationSlots.findMany({
      where: eq(evaluationSlots.id, evaluationSlotId),
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
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    throw new Error("Failed to fetch evaluations");
  }
}

function transformEvaluations(dbEvaluations: DbEvaluation[]): Evaluation[] {
  return dbEvaluations.flatMap((slot) =>
    slot.evaluatees.map((evaluatee) => ({
      id: evaluatee.id,
      student: evaluatee.user.name || "Unknown",
      evaluator: "TBD", // We don't have evaluator information in the current query
      project: slot.project || "Unknown",
      date: slot.startDateTime.toISOString(),
      status: slot.isEvaluated ? "Completed" : "Pending",
    }))
  );
}

function isStaffMember(email: string): boolean {
  return email.endsWith("@staff.42.fr");
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    evaluationSlotId?: string;
  };
}) {
  try {
    // const session = await auth();

    // if (!session || !session.user?.email) {
    //   redirect("/");
    // }

    // const isStaff = isStaffMember(session.user.email);

    // if (!isStaff) {
    //   redirect("/unauthorized"); // Assuming you have an unauthorized page
    // }

    const dbEvaluations = await getAllEvaluations({
      evaluationSlotId: searchParams?.evaluationSlotId || "",
    });
    const evaluationsData = transformEvaluations(dbEvaluations);

    return <StaffEvaluations evaluations={evaluationsData} />;
  } catch (error) {
    console.error("Error in EvaluationsPage:", error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
