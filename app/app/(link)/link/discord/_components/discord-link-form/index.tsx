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
import { handleLinkCodeSubmission } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  linkCode: z.string(),
});

export interface IDiscordLinkForm {
  token: string;
}

export function DiscordLinkForm(p: IDiscordLinkForm) {
  const router = useRouter();
  let linkCode = useLinkCodeStore.getState().linkCode;
  const setLinkCode = useLinkCodeStore.getState().setLinkCode;

  linkCode = p.token || linkCode;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { linkCode },
  });

  async function onSubmit() {
    const { data, error } = await handleLinkCodeSubmission({
      linkCode: form.getValues().linkCode,
    });
    if (error) {
      return toast.error("Sorry, something went wrong.");
    }
    toast.success(
      "Discord account linked successfully! Redirecting to your profile.",
    );
    router.push("/dashboard/profile");
  }
  async function onChange() {
    setLinkCode(form.getValues().linkCode);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={form.handleSubmit(onChange)}
        className="w-2/3 space-y-6"
      >
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
