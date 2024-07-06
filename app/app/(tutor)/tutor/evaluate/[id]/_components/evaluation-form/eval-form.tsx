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

const FormSchema = z.array(
  z.object({
    name: z.string(),
    evaluateeId: z.string(),
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
  function onSubmit() {
    console.log(form.getValues());
    toast.success(<pre>{JSON.stringify(form.getValues(), null, 2)}</pre>);
  }

  return (
    <div className="flex flex-col gap-4">
      <TypographyH2>Evaluatees</TypographyH2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="flex gap-2">
              <Avatar className="min-h-24 min-w-24">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 w-full">
                <p className="font-bold">{field.name}</p>
                <Textarea {...form.register(`evaluatees.${index}.comment`)} />
              </div>
            </div>
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
