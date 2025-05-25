import { checkServiceToken } from "@/lib/auths/core";
import { db } from "@/lib/db/clients";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Retrieves a paginated list of users with their basic information and Discord profile data.
 *
 * @param request - The HTTP request object containing query parameters for pagination
 * @returns A JSON response containing:
 *   - `users`: Array of user objects with id, name, email, and Discord ID
 *   - `pagination`: Object with currentPage, totalPages, totalUsers, and limit
 *
 * @throws {401} Unauthorized - When service token validation fails
 * @throws {400} Bad Request - When pagination parameters are invalid (non-numeric or less than 1)
 *
 * @example
 * ```
 * GET /api/users?page=1&limit=10
 * ```
 *
 * Query Parameters:
 * - `page` (optional): Page number, defaults to 1
 * - `limit` (optional): Number of users per page, defaults to 10
 */
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
