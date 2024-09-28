"use client";

import { Button } from "@/components/ui/button";
import { BookSlot } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const BookSlotBtn = ({ startDateTime }: { startDateTime: Date }) => {
  const router = useRouter();
  async function handleClick() {
    const { data, error } = await BookSlot({ startDateTime });
    if (error) {
      toast.error(error);
    }
    if (data) {
      toast.success("Slot booked");
    }
    router.push(`/dashboard/evaluation/${data!.evaluationSlotId}/edit`);
  }
  return <Button onClick={handleClick}>Book</Button>;
};
