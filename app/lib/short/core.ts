import { shortLinks } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { IGetShortLink, INewShortLinkId } from "./types";
import { and, eq, isNull } from "drizzle-orm";

/**
 * Creates a new short link.
 * @param p - The parameters for creating the short link.
 * @returns A promise that resolves to the ID of the newly created short link.
 */
export async function newShortLinkId(p: INewShortLinkId): Promise<string> {
  const { id } = (
    await db.insert(shortLinks).values(p).returning({ id: shortLinks.id })
  )[0];
  return id;
}

/**
 * Gets a short link by its ID.
 * @param p - The parameters for getting the short link.
 * @returns A promise that resolves to the short link, if it exists.
 */
export async function getShortLink(p: IGetShortLink) {
  const r = await db.query.shortLinks.findFirst({
    where: and(eq(shortLinks.id, p.id), isNull(shortLinks.deleted)),
  });

  return r ?? null;
}
