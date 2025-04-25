"use client";

import { DataTable } from "@/components/ui/data-table";
import { userColumns, UserRow } from "./columns";

interface UsersTableProps {
  data: UserRow[];
}

export function UsersTable({ data }: UsersTableProps) {
  return <DataTable columns={userColumns} data={data} />;
}
