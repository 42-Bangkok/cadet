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

export default async function Page() {
  const dbEvaluationSlots = await getEvaluatedSlots();
  const evaluationSlots = transformEvaluationSlots(dbEvaluationSlots);

  return (
    <div className="flex flex-col gap-4">
      <BackBtn />
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
