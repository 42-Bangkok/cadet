"use server";

import { profiles } from "@/drizzle/schemas";
import { db } from "@/lib/db/clients";
import { SAResponse } from "@/types/sa-response";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Set the foreigner status of a profile.
 * @param {Object} options - The options object.
 * @param {string} options.id - The id of the profile.
 * @param {boolean} options.foreigner - The foreigner status of the profile.
 */
export async function setForeigner({
  id,
  foreigner,
}: {
  id: string;
  foreigner: boolean;
}): Promise<SAResponse<boolean>> {
  try {
    await db
      .update(profiles)
      .set({ foreigner: foreigner })
      .where(eq(profiles.id, id));
    revalidatePath("/tutor");
    return { data: true, error: null };
  } catch (error) {
    return { data: null, error: "Something went wrong." };
  }
}
