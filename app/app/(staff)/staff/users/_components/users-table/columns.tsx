import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  discordId: string;
  account42Id: string;
}

export const userColumns: ColumnDef<UserRow>[] = [
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const id = row.original.account42Id;
      return (
        <Link
          href={`/staff/users/profile/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          title="View student info"
          className="flex items-center justify-center"
        >
          <Eye className="w-4 h-4 hover:text-blue-600 transition-colors" />
        </Link>
      );
    },
    enableSorting: false,
    size: 40,
    minSize: 32,
    maxSize: 48,
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "discordId", header: "Discord ID" },
  { accessorKey: "account42Id", header: "42-school ID" },
];
