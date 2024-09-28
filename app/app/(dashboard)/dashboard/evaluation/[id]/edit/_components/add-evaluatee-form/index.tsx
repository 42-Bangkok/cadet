"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addEvaluatee } from "./actions";
const FormSchema = z.object({
  evaluateeLogin: z.string().min(2, {
    message: "Login must be at least 2 characters.",
  }),
});

export function AddEvaluateeForm({
  evaluationSlotId,
}: {
  evaluationSlotId: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      evaluateeLogin: "",
    },
  });

  async function onSubmit() {
    const { data, error } = await addEvaluatee({
      evaluationSlotId,
      evaluateeLogin: form.getValues("evaluateeLogin"),
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Evaluatee added");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="evaluateeLogin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Members</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="intra login..."
                    className="w-[200px]"
                    {...field}
                  />
                  <Button type="submit">Submit</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
