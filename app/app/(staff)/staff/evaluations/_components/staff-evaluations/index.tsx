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

interface Evaluation {
  id: string;
  student: string;
  evaluator: string;
  project: string;
  date: string;
  status: string;
}

interface StaffEvaluationsProps {
  evaluations: Evaluation[];
}

export function StaffEvaluations({ evaluations }: StaffEvaluationsProps) {
  return (
    <div className="container mx-auto py-10">
      <BackBtn />
      <Card>
        <CardHeader>
          <CardTitle>All Evaluations</CardTitle>
          <p>Total: {evaluations.length} evaluations</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Evaluator</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{evaluation.id}</TableCell>
                  <TableCell>{evaluation.student}</TableCell>
                  <TableCell>{evaluation.evaluator}</TableCell>
                  <TableCell>{evaluation.project}</TableCell>
                  <TableCell>{evaluation.date}</TableCell>
                  <TableCell>{evaluation.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
