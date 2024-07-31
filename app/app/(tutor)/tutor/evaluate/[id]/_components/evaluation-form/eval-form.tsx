"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH2 } from "@/components/typographies";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IntraAvatar } from "./intra-avatar";
import { submitEvaluation } from "./actions";

const FormSchema = z.array(
  z.object({
    name: z.string(),
    evaluateeId: z.string(),
    isTeamLeader: z.boolean(),
    comment: z.string(),
  })
);

export function EvalForm(p: { evaluatees: z.infer<typeof FormSchema> }) {
  const form = useForm({
    defaultValues: p,
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "evaluatees",
  });
  async function onSubmit() {
    const evaluatees = form.getValues().evaluatees.map((evaluatee) => ({
      evaluateeId: evaluatee.evaluateeId,
      comment: evaluatee.comment,
    }));
    const { data, error } = await submitEvaluation({
      evaluatees,
    });
    if (error) {
      toast.error("Error saving evaluation");
      return;
    }
    form.reset({ ...form.getValues() });
    toast.success("Saved");
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {fields.map((field, index) => {
          return (
            <Card key={field.id} className="flex gap-2 p-4 h-32 rounded-l-none">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <p className="font-bold">{field.name}</p>
                  {field.isTeamLeader && <Badge>Team Leader</Badge>}
                </div>
                <Textarea {...form.register(`evaluatees.${index}.comment`)} />
              </div>
            </Card>
          );
        })}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
