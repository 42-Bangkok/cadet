"use client";

import { DataTable } from "@/components/ui/data-table";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { InferSelectModel } from "drizzle-orm";
import { columns } from "./columns";

type TSlots = InferSelectModel<typeof evaluationSlots> & {
  evaluatees: InferSelectModel<typeof evaluatees>[];
};

interface ITab {
  slots: TSlots[];
}

export const SlotsTable = (p: ITab) => {
  return <DataTable columns={columns} data={p.slots} />;
};
