import { shortLinks } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { getShortLink } from "@/lib/short/core";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { sid: string } }) {
  const shortLink = await getShortLink({ id: params.sid });
  // TODO: handle analytics, if owned by a user, if owned by subscribed user advanced analytics

  // handle redirect
  if (shortLink === null) {
    redirect("/");
  }
  // update the last accessed time if it hasn't been updated today
  if (
    new Date(shortLink.updated.toDateString()) <
    new Date(new Date().toDateString())
  ) {
    await db
      .update(shortLinks)
      .set({ updated: new Date() })
      .where(eq(shortLinks.id, shortLink.id));
  }

  let url = shortLink.url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    redirect(url);
  }
  url = `https://${url}`;
  redirect(url);
}
