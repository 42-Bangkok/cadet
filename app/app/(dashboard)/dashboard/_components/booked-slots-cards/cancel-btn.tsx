"use client";

import { Button } from "@/components/ui/button";
import { cancelBookedSlot } from "./actions";
import { toast } from "sonner";

export const CancelBtn = ({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) => {
  async function handleClick() {
    const { data, error } = await cancelBookedSlot({ id });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Slot cancelled");
  }
  return (
    <Button variant="destructive" onClick={handleClick} disabled={disabled}>
      Cancel
    </Button>
  );
};
