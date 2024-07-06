import { getEvaluationSlot } from "../../page";
import { EvalForm } from "./eval-form";

type TEvaluationForm = NonNullable<
  Awaited<ReturnType<typeof getEvaluationSlot>>
>;

export const EvaluationForm = (p: TEvaluationForm) => {
  const timeEnds = new Date(p.startDateTime);
  timeEnds.setHours(timeEnds.getHours() + 1);
  const evalFormProps = {
    evaluatees: p.evaluatees.map((evaluatee) => ({
      name: evaluatee.user.name!,
      evaluateeId: evaluatee.id,
      comment: evaluatee.comment,
    })),
  };
  return (
    <div>
      <p className="font-bold">Time:</p>
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
      <EvalForm {...evalFormProps} />
      {/* <pre>{JSON.stringify(p, null, 2)}</pre> */}
    </div>
  );
};
