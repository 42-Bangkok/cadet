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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { setForeigner } from "./actions";

interface ISwitchForm {
  id: string;
  foreigner: boolean;
}

const FormSchema = z.object({
  foreigner: z.boolean(),
});

/**
 * The switch form.
 * @param {Object} p - The props object.
 * @param {string} p.id - The id of the profile.
 * @param {boolean} p.foreigner - The foreigner status of the profile.
 */
export function SwitchForm(p: ISwitchForm) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      foreigner: p.foreigner,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await setForeigner({ id: p.id, foreigner: data.foreigner });
    form.reset({ foreigner: data.foreigner });
    toast.success("Settings saved!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={form.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="foreigner"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center rounded-lg border p-4 gap-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Are you a foreigner?
                    </FormLabel>
                    <FormDescription>
                      Toggle this switch if you are a foreigner, and cannot
                      speak Thai.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
