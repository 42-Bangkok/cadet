import { auth } from "@/auth";
import { checkServiceToken } from "@/lib/auths/core";
import { insertLinkCode } from "@/lib/db/links";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  discord_id: z.string(),
});

/**
 * Generate a link code for the user to connect their discord account
 * 
curl -X POST \
http://localhost:3000/api/link/discord/generate-link-code \
-H "Authorization: Bearer $SERVICE_TOKEN \
-H "Content-Type: application/json" \
-d '{"discord_id": 123456789012345678}'
 */
export async function POST(request: Request) {
  const TIME_LIMIT = 1000 * 60 * 5;

  if (!checkServiceToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsedBody = postSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.errors },
      { status: 422 },
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
