import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InferSelectModel } from "drizzle-orm";
import { evaluatees, evaluationSlots, users } from "@/drizzle/schemas";
import { CancelBtn } from "./cancel-btn";

export type TBookedSlotCard = InferSelectModel<typeof evaluationSlots> & {
  evaluatees: InferSelectModel<typeof evaluatees>[];
  evaluationSlot: InferSelectModel<typeof evaluationSlots>;
  evaluator: InferSelectModel<typeof users>;
};

export const BookedSlotCard = (p: TBookedSlotCard) => {
  const timeEnds = new Date(p.evaluationSlot.startDateTime);
  timeEnds.setHours(timeEnds.getHours() + 1);
  const remainingHours = Math.floor(
    (p.evaluationSlot.startDateTime.getTime() - new Date().getTime()) /
      (1000 * 60 * 60)
  );
  const isCancelable =
    p.evaluationSlot.startDateTime.getTime() - Date.now() > 1000 * 60 * 30;
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Evaluation by tutor</CardTitle>
        <CardDescription>in {remainingHours} hours</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Evaluator: Time:</p>
        <p>
          {p.evaluationSlot.startDateTime.toLocaleString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          ~{" "}
          {timeEnds.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="font-bold">Evaluator:</p>
        <p>{isCancelable ? "hidden until uncancellable." : p.evaluator.name}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CancelBtn id={p.evaluationSlot.id} disabled={!isCancelable} />
      </CardFooter>
    </Card>
  );
};
