import { Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
  {
    id: "actions",
    header: "Actions",
    cell: function ActionsCell({ row }) {
      const id = row.original.account42Id;
      return (
        <Link
          href={`/staff/users/profile/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          title="View student info"
        >
          <Eye className="w-5 h-5 hover:text-blue-600 transition-colors" />
        </Link>
      );
    },
    enableSorting: false,
  },
];
