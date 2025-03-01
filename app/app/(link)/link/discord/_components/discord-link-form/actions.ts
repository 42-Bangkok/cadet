"use server";

import { auth } from "@/auth";
import { assignDiscordIdWithLinkCode } from "@/lib/db/links";
import { SAResponse } from "@/types/sa-response";

export async function handleLinkCodeSubmission(formData: {
  linkCode: string;
}): Promise<SAResponse<boolean>> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const r = await assignDiscordIdWithLinkCode({
    userId: session!.user!.id!,
    linkCode: formData.linkCode,
  });
  console.log(r);
  return {
    data: true,
    error: null,
  };
}
