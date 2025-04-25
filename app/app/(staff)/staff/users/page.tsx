import { UsersTable } from "./_components/users-table";
import { UserRow } from "./_components/users-table/columns";
import { ColumnDef } from "@tanstack/react-table";
import { Suspense } from "react";
import { db } from "@/lib/db/clients";
import { profiles } from "@/drizzle/schemas";
import { TypographyH1 } from "@/components/typographies";
import { BackBtn } from "@/components/back-btn";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import Link from "next/link";

const PAGE_SIZE = 100;

export default async function Page({
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const search = await searchParams;
  const page = parseInt((search.page as string) || "1", 10);
  const sort = (search.sort as string) || "name";
  const order = (search.order as string) || "asc";

  // Get all users and their profiles, and their 42-school account
  const allProfiles = await db.query.profiles.findMany({
    with: {
      user: {
        with: {
          accounts: true,
        },
      },
    },
  });

  // Transform data for the datatable
  let data: UserRow[] = allProfiles.map((profile) => {
    const account42 = profile.user?.accounts?.find(
      (acc) => acc.provider === "42-school",
    );
    return {
      id: profile.id,
      name: profile.user?.name || "No Name",
      email: profile.user?.email || "",
      discordId: profile.discordId || "Not linked",
      account42Id: account42?.providerAccountId || "-",
    };
  });

  // Sort
  data = data.sort((a, b) => {
    const aVal = a[sort as keyof typeof a] || "";
    const bVal = b[sort as keyof typeof b] || "";
    if (order === "desc") {
      return String(bVal).localeCompare(String(aVal));
    }
    return String(aVal).localeCompare(String(bVal));
  });

  // Pagination
  const total = data.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: ColumnDef<(typeof data)[0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "discordId",
      header: "Discord ID",
      cell: ({ row }) => row.getValue("discordId"),
    },
    {
      accessorKey: "account42Id",
      header: "42-school ID",
      cell: ({ row }) => row.getValue("account42Id"),
    },
  ];

  return (
    <main className="flex flex-col gap-4">
      <BackBtn />
      <TypographyH1>Users</TypographyH1>
      <div className="flex gap-2 mb-2">
        <Link
          href={`?sort=name&order=${
            sort === "name" && order === "asc" ? "desc" : "asc"
          }&page=1`}
          className={sort === "name" ? "font-bold underline" : ""}
        >
          Name{sort === "name" ? (order === "asc" ? " ▲" : " ▼") : ""}
        </Link>
        <Link
          href={`?sort=email&order=${
            sort === "email" && order === "asc" ? "desc" : "asc"
          }&page=1`}
          className={sort === "email" ? "font-bold underline" : ""}
        >
          Email{sort === "email" ? (order === "asc" ? " ▲" : " ▼") : ""}
        </Link>
        <Link
          href={`?sort=discordId&order=${
            sort === "discordId" && order === "asc" ? "desc" : "asc"
          }&page=1`}
          className={sort === "discordId" ? "font-bold underline" : ""}
        >
          Discord ID
          {sort === "discordId" ? (order === "asc" ? " ▲" : " ▼") : ""}
        </Link>
        <Link
          href={`?sort=account42Id&order=${
            sort === "account42Id" && order === "asc" ? "desc" : "asc"
          }&page=1`}
          className={sort === "account42Id" ? "font-bold underline" : ""}
        >
          42-school ID
          {sort === "account42Id" ? (order === "asc" ? " ▲" : " ▼") : ""}
        </Link>
      </div>
      <Pagination className="mb-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?sort=${sort}&order=${order}&page=${page - 1}`}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : 0}
              style={page <= 1 ? { pointerEvents: "none", opacity: 0.5 } : {}}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 py-1">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`?sort=${sort}&order=${order}&page=${page + 1}`}
              aria-disabled={page >= totalPages}
              tabIndex={page >= totalPages ? -1 : 0}
              style={
                page >= totalPages
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : {}
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Suspense fallback={<div>Loading...</div>}>
        <UsersTable data={pagedData} />
      </Suspense>
      <Pagination className="mt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?sort=${sort}&order=${order}&page=${page - 1}`}
              aria-disabled={page <= 1}
              tabIndex={page <= 1 ? -1 : 0}
              style={page <= 1 ? { pointerEvents: "none", opacity: 0.5 } : {}}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 py-1">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={`?sort=${sort}&order=${order}&page=${page + 1}`}
              aria-disabled={page >= totalPages}
              tabIndex={page >= totalPages ? -1 : 0}
              style={
                page >= totalPages
                  ? { pointerEvents: "none", opacity: 0.5 }
                  : {}
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
