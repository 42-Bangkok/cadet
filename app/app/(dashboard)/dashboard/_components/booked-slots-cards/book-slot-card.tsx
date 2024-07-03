import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InferSelectModel } from "drizzle-orm";
import { evaluationSlots, users } from "@/drizzle/schemas";
import { CancelBtn } from "./cancel-btn";

type TBookedSlotCard = InferSelectModel<typeof evaluationSlots> & {
  evaluator: InferSelectModel<typeof users>;
};

export const BookedSlotCard = (p: TBookedSlotCard) => {
  const timeEnds = new Date(p.startDateTime);
  timeEnds.setHours(timeEnds.getHours() + 1);
  const remainingHours = Math.floor(
    (p.startDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60)
  );
  const isCancelable = p.startDateTime.getTime() - Date.now() > 1000 * 60 * 30;
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Evaluation by tutor</CardTitle>
        <CardDescription>in {remainingHours} hours</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-bold">Evaluator: Time:</p>
        <p>
          {p.startDateTime.toLocaleString("en-US", {
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
        <CancelBtn id={p.id} disabled={!isCancelable} />
      </CardFooter>
    </Card>
  );
};
