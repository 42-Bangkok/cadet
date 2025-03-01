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

interface IAssignDiscordIdWithLinkCode {
  userId: string;
  linkCode: string;
}

/**
 * Assign a Discord ID to a user based on a link code
 * @param userId The ID of the user to update
 * @param linkCode The link code to use for Discord ID assignment
 * @returns Object indicating success or failure with optional error message
 */
export const assignDiscordIdWithLinkCode = async (
  p: IAssignDiscordIdWithLinkCode
) => {
  // Find the link code entry
  const linkCodeEntry = await db
    .select()
    .from(linkCodes)
    .where(eq(linkCodes.linkCode, p.linkCode))
    .limit(1);

  if (linkCodeEntry.length === 0) {
    return { success: false, error: "Invalid link code" };
  }

  const linkData = linkCodeEntry[0];

  // Check if the link code has expired
  if (new Date() > linkData.expiresAt) {
    return { success: false, error: "Link code has expired" };
  }
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, p.userId),
  });
  if (!profile) {
    await db.insert(profiles).values({
      userId: p.userId,
      discordId: linkData.discordId,
    });
    await db.delete(linkCodes).where(eq(linkCodes.linkCode, p.linkCode));
    return { success: true };
  }

  // Update the user's Discord ID
  await db
    .update(profiles)
    .set({ discordId: linkData.discordId })
    .where(eq(profiles.userId, p.userId));

  // Delete the used link code to prevent reuse
  await db.delete(linkCodes).where(eq(linkCodes.linkCode, p.linkCode));

  return { success: true };
};
