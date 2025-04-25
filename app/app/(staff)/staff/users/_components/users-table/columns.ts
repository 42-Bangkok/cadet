import { ColumnDef } from "@tanstack/react-table";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  discordId: string;
  account42Id: string;
}

export const userColumns: ColumnDef<UserRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "discordId", header: "Discord ID" },
  { accessorKey: "account42Id", header: "42-school ID" },
];
