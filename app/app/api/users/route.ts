import { checkServiceToken } from "@/lib/auths/core";
import { db } from "@/lib/db/clients";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (checkServiceToken(request) === false) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json(
      { error: "Invalid pagination parameters" },
      { status: 400 }
    );
  }

  const offset = (page - 1) * limit;

  const [allUsers, totalUsers] = await Promise.all([
    db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
      },
      with: {
        profile: {
          columns: {
            discordId: true,
          },
        },
      },
      limit: limit,
      offset: offset,
    }),
    db.query.users
      .findMany({ columns: { id: true } })
      .then((users) => users.length), // A more efficient count would be ideal if your DB supports it directly
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return NextResponse.json({
    users: allUsers,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalUsers,
      limit: limit,
    },
  });
}
