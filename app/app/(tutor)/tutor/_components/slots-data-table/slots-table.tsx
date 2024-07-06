"use client";

import { DataTable } from "@/components/ui/data-table";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { InferSelectModel } from "drizzle-orm";
import { columns } from "./columns";

type TSlots = InferSelectModel<typeof evaluationSlots> & {
  evaluatees: InferSelectModel<typeof evaluatees>[];
};

interface ISlotsTab {
  slots: TSlots[];
}

export const SlotsTable = (p: ISlotsTab) => {
  return <DataTable columns={columns} data={p.slots} />;
};
