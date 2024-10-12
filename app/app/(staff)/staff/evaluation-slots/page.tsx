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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvaluatedSlots, transformEvaluationSlots } from "./utils";
import { redirect } from "next/navigation";
import { FromInput } from "./_components/from-input";

export default async function Page({
  searchParams: searchParams,
}: {
  searchParams: { from?: string };
}) {
  if (!searchParams.from) {
    const prev30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const from = prev30Days.toISOString().split("T")[0];
    redirect(`/staff/evaluation-slots?from=${from}`);
  }
  const dbEvaluationSlots = await getEvaluatedSlots({
    from: searchParams.from,
  });
  const evaluationSlots = transformEvaluationSlots(dbEvaluationSlots);

  return (
    <div className="flex flex-col gap-4">
      <BackBtn />
      <FromInput from={searchParams.from} />
      <Card>
        <CardHeader>
          <CardTitle>Evaluated Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluationSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <Link
                      href={`/staff/evaluations?evaluationSlotId=${slot.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell>{slot.project}</TableCell>
                  <TableCell>{new Date(slot.date).toLocaleString()}</TableCell>
                  <TableCell>{slot.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
