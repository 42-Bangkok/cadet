"use client";

import { DataTable } from "@/components/ui/data-table";
import { evaluationSlots } from "@/drizzle/schemas";
import { InferSelectModel } from "drizzle-orm";
import { columns } from "./columns";

interface ITab {
  slots: InferSelectModel<typeof evaluationSlots>[];
}

export const SlotsTable = (p: ITab) => {
  return <DataTable columns={columns} data={p.slots} />;
};
