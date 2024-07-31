import { Badge } from "@/components/ui/badge";
import { evaluatees, evaluationSlots } from "@/drizzle/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import { deleteSlot } from "./actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash } from "iconoir-react";
import Link from "next/link";

const DeleteBtn = ({ id, disabled }: { id: string; disabled: boolean }) => {
  return (
    <Button
      variant="ghost"
      className="p-4"
      disabled={disabled}
      onClick={async () => {
        const { data, error } = await deleteSlot({
          id,
        });
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Slot deleted");
      }}
    >
      <Trash width={16} height={16} color="red" />
    </Button>
  );
};

type TEvaluationSlots = InferSelectModel<typeof evaluationSlots> & {
  evaluatees: InferSelectModel<typeof evaluatees>[];
};

export const columns: ColumnDef<TEvaluationSlots>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    header: "Actions",
    accessorKey: "id",
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          <Link href={`/tutor/evaluate/${row.original.id}/`}>
            <Button>Evaluate</Button>
          </Link>
          <DeleteBtn id={row.original.id} disabled={row.original.isEvaluated} />
        </div>
      );
    },
  },
  {
    header: "Booked",
    cell: ({ row }) => {
      return row.original.evaluatees.length != 0 ? (
        <Badge>Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      );
    },
  },
  {
    id: "date",
    accessorKey: "startDateTime",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.startDateTime.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <div suppressHydrationWarning>{date}</div>;
    },
  },
  {
    accessorKey: "startDateTime",
    header: "Time",
    cell: ({ row }) => {
      const start = (row.getValue("startDateTime") as Date).toLocaleString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      const startDateTime = new Date(row.getValue("startDateTime") as Date);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);
      const end = endDateTime.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${start} ~ ${end}`;
    },
  },
];
