import { insertLinkCode } from "@/lib/db/links";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  discord_id: z.number(),
});

/**
 * Generate a link code for the user to connect their discord account
 */
export async function POST(request: Request) {
  const TIME_LIMIT = 1000 * 60 * 5;
  const parsedBody = postSchema.safeParse(await request.json());
  console.log(parsedBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.errors },
      { status: 422 }
    );
  }
  const linkCode = nanoid();
  const expiresAt = new Date(Date.now() + TIME_LIMIT);
  insertLinkCode({
    discordId: parsedBody.data.discord_id,
    linkCode: linkCode,
    expiresAt: expiresAt,
  });
  return NextResponse.json({ link_code: linkCode, expires_at: expiresAt });
}
