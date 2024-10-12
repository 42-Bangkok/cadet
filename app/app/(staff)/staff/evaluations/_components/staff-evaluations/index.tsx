import { BackBtn } from "@/components/back-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transformEvaluations } from "../../utils";

export function StaffEvaluations({
  evaluations,
}: {
  evaluations: Awaited<ReturnType<typeof transformEvaluations>>;
}) {
  return (
    <main className="flex flex-col gap-4">
      <BackBtn />
      <Card>
        <CardHeader>
          <CardTitle>Evaluations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.project}</TableCell>
                  <TableCell>{evaluation.student}</TableCell>
                  <TableHead>{evaluation.comment}</TableHead>
                  <TableCell>{evaluation.evaluator}</TableCell>
                  <TableCell>{evaluation.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
