import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mocks
globalThis.fetch = vi.fn();

vi.mock("@/lib/auths/core", () => ({
  checkServiceToken: vi.fn(),
}));
vi.mock("@/lib/db/clients", () => ({
  db: {
    query: {
      users: {
        findMany: vi.fn(),
      },
    },
  },
}));

import * as authCore from "@/lib/auths/core";
import * as dbClients from "@/lib/db/clients";

// Helper to allow mocking of ES module functions
function mockFunction<T extends object, K extends keyof T>(obj: T, key: K) {
  return vi.spyOn(obj, key as string);
}

describe("GET /api/users", () => {
  const mockRequest = (url: string) => ({ url } as Request);
  let checkServiceToken: ReturnType<typeof vi.fn>;
  let db: typeof dbClients.db;

  beforeEach(() => {
    vi.clearAllMocks();
    checkServiceToken = mockFunction(authCore, "checkServiceToken");
    db = dbClients.db;
    // @ts-ignore
    db.query.users.findMany = vi.fn();
  });

  it("returns 401 if service token is invalid", async () => {
    checkServiceToken.mockReturnValue(false);
    const res = await GET(mockRequest("http://localhost/api/users"));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 400 for invalid pagination params", async () => {
    checkServiceToken.mockReturnValue(true);
    const res = await GET(
      mockRequest("http://localhost/api/users?page=abc&limit=xyz")
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid pagination parameters");
  });

  it("returns paginated users and pagination info", async () => {
    checkServiceToken.mockReturnValue(true);
    // @ts-ignore
    db.query.users.findMany
      .mockImplementationOnce(() =>
        Promise.resolve([
          {
            id: 1,
            name: "User1",
            email: "user1@example.com",
            profile: { discordId: "123" },
          },
          {
            id: 2,
            name: "User2",
            email: "user2@example.com",
            profile: { discordId: "456" },
          },
        ])
      )
      .mockImplementationOnce(() =>
        Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
      );
    const res = await GET(
      mockRequest("http://localhost/api/users?page=1&limit=2")
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.users.length).toBe(2);
    expect(json.pagination).toEqual({
      currentPage: 1,
      totalPages: 2,
      totalUsers: 4,
      limit: 2,
    });
  });
});
