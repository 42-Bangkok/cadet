"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createEvaluationSlots } from "./actions";
import { useState } from "react";

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  startTime: z
    .string({
      required_error: "A start time is required.",
    })
    .refine(
      (value) => {
        const [hours, minutes] = value.split(":").map(Number);
        return hours >= 8 && hours <= 17 && minutes >= 0 && minutes < 60;
      },
      {
        message: "Invalid time.",
      }
    ),
  endTime: z
    .string({
      required_error: "An end time is required.",
    })
    .refine(
      (value) => {
        const [hours, minutes] = value.split(":").map(Number);
        return hours >= 0 && hours <= 17 && minutes >= 0 && minutes < 60;
      },
      {
        message: "Invalid time.",
      }
    ),
});

export const CreateSlotDialog = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      startTime: "08:00",
      endTime: "17:00",
    },
  });
  async function onSubmit() {
    if (
      Number(form.getValues("startTime").split(":")[0]) >=
      Number(form.getValues("endTime").split(":")[0])
    ) {
      toast.error("End time must be after start time.");
      return;
    }
    const { data, error } = await createEvaluationSlots({
      date: new Date(form.getValues("date")),
      startTime: form.getValues("startTime"),
      endTime: form.getValues("endTime"),
    });
    if (error) {
      toast.error("Failed to create slots.");
      return;
    }
    toast.success(`Created ${data} slots.`);
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-32">Create slots</Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>Create slots</DialogTitle>
          <DialogDescription>
            Select a date and a range of time available for cadets to book.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <= new Date() || date < new Date("1900-01-01")
                    }
                    className="rounded-md border"
                    initialFocus
                  />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        {...field}
                        type="time"
                        step={3600}
                        onChange={(e) => {
                          // disallow minutes
                          const date = new Date();
                          const [hours] = e.target.value.split(":");
                          date.setHours(Number(hours), 0, 0, 0);
                          form.setValue(
                            "startTime",
                            date.toTimeString().slice(0, 5)
                          );
                        }}
                        className="w-full"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        {...field}
                        type="time"
                        step={3600}
                        onChange={(e) => {
                          // disallow minutes
                          const date = new Date();
                          const [hours] = e.target.value.split(":");
                          date.setHours(Number(hours), 0, 0, 0);
                          form.setValue(
                            "startTime",
                            date.toTimeString().slice(0, 5)
                          );
                        }}
                        className="w-full"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormDescription>
                  Time must be from 8:00 to 17:00.
                </FormDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  Create slots
                </Button>
                <Button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="w-full"
                  variant={"destructive"}
                >
                  Close
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
