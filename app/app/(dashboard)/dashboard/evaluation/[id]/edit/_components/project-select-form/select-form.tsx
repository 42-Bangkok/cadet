"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { submitProject } from "./actions";

const FormSchema = z.object({
  project: z.string({
    required_error: "Please select a project to be evaluated.",
  }),
});

interface ISelectForm {
  selects: Array<{ label: string; value: string }>;
  project: string | null;
  evaluationSlotId: string;
}

export const SelectForm = (p: ISelectForm) => {
  const selectValues = p.selects;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: p.project ? { project: p.project } : {},
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { data: res, error } = await submitProject({
      project: data.project,
      evaluationSlotId: p.evaluationSlotId,
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Saved");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <div className="flex gap-2">
                <div className="w-[200px]">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectValues.map((project) => (
                        <SelectItem key={project.value} value={project.value}>
                          {project.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Submit
                </Button>
              </div>
              <FormDescription>Select project to be evaluated</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
