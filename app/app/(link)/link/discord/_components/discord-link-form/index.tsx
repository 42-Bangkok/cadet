"use client";

import { useLinkCodeStore } from "../../store";

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
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  linkCode: z.string(),
});

export interface IDiscordLinkForm {
  token: string;
}

export function DiscordLinkForm(p: IDiscordLinkForm) {
  let linkCode = useLinkCodeStore.getState().linkCode;

  linkCode = p.token || linkCode;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { linkCode },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="linkCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Code</FormLabel>
              <FormControl>
                <Input placeholder="token" {...field} />
              </FormControl>
              <FormDescription>
                You can get the token from Marvin the discord bot.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
