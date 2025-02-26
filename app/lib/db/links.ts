import { profiles, users } from "@/drizzle/schemas";
import { linkCodes } from "../../drizzle/schemas/users/link";
import { db } from "./clients";
import { eq } from "drizzle-orm";

interface ICreateLinkCode {
  discordId: string;
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

/**
 * Assign a Discord ID to a user based on a link code
 * @param userId The ID of the user to update
 * @param linkCode The link code to use for Discord ID assignment
 * @returns Object indicating success or failure with optional error message
 */
export const assignDiscordIdWithLinkCode = async (
  userId: string,
  linkCode: string
) => {
  // Find the link code entry
  const linkCodeEntry = await db
    .select()
    .from(linkCodes)
    .where(eq(linkCodes.linkCode, linkCode))
    .limit(1);

  if (linkCodeEntry.length === 0) {
    return { success: false, error: "Invalid link code" };
  }

  const linkData = linkCodeEntry[0];

  // Check if the link code has expired
  if (new Date() > linkData.expiresAt) {
    return { success: false, error: "Link code has expired" };
  }

  // Update the user's Discord ID
  await db
    .update(profiles)
    .set({ discordId: linkData.discordId })
    .where(eq(users.id, userId));

  // Delete the used link code to prevent reuse
  await db.delete(linkCodes).where(eq(linkCodes.linkCode, linkCode));

  return { success: true };
};
