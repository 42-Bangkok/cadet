"use client";

import { DataTable } from "@/components/ui/data-table";
import { TColumn, columns } from "./columns";

export const SlotsTable = ({ data }: { data: TColumn[] }) => {
  return <DataTable data={data} columns={columns} />;
};
