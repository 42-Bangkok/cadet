import { Badge } from "@/components/ui/badge";
import { evaluationSlots } from "@/drizzle/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { InferSelectModel } from "drizzle-orm";
import { deleteSlot } from "./actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash } from "iconoir-react";

const DeleteBtn = ({ id }: { id: string }) => {
  return (
    <Button
      variant="ghost"
      className="p-4"
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

export const columns: ColumnDef<InferSelectModel<typeof evaluationSlots>>[] = [
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
      return <DeleteBtn id={row.getValue("id") as string} />;
    },
  },
  {
    header: "Booked",
    cell: ({ row }) => {
      return row.getValue("teamLeaderUserId") ? (
        <Badge>Yes</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      );
    },
  },
  {
    accessorKey: "startDateTime",
    header: "Starts",
    cell: ({ row }) => {
      return (row.getValue("startDateTime") as Date).toLocaleString(
        "en-US",
        {}
      );
    },
  },
  {
    accessorKey: "startDateTime",
    header: "Ends",
    cell: ({ row }) => {
      const startDateTime = new Date(row.getValue("startDateTime") as Date);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1);
      return endDateTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    },
  },
];
