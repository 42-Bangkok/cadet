import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { eq } from "drizzle-orm";

/**
 * Get user's profile.
 * @param {Object} options - The options object.
 * @param {string} options.id - The id of the user.
 */
export async function getOrCreateProfile({ id }: { id: string }) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, id),
  });
  if (profile) {
    // attempt to pull login if not present
    return profile;
  }
  // also pull login if created
  return (await db.insert(profiles).values({ userId: id }).returning())[0];
}
