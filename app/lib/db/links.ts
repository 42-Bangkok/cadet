import { linkCodes } from "../../drizzle/schemas/users/link";
import { db } from "./clients";

interface ICreateLinkCode {
  discordId: number;
  linkCode: string;
  expiresAt: Date;
}

/**
 * insert a new link code into the database
 */
export const insertLinkCode = async (p: ICreateLinkCode) => {
  return db
    .insert(linkCodes)
    .values({
      discordId: p.discordId,
      linkCode: p.linkCode,
      expiresAt: p.expiresAt,
    })
    .returning();
};
