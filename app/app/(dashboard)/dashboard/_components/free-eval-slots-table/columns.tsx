import { ColumnDef } from "@tanstack/react-table";
import { BookSlotBtn } from "./book-slot-btn";

export type TColumn = {
  startDateTime: Date;
};

export const columns: ColumnDef<TColumn>[] = [
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
      return <BookSlotBtn startDateTime={row.getValue("startDateTime")} />;
    },
  },
  {
    accessorKey: "startDateTime",
    header: "Date",
    cell: ({ row }) => {
      return (row.getValue("startDateTime") as Date).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
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
