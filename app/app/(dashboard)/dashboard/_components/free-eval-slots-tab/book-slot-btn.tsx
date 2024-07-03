import { Button } from "@/components/ui/button";
import { BookSlot } from "./actions";
import { toast } from "sonner";

export const BookSlotBtn = ({ startDateTime }: { startDateTime: Date }) => {
  async function handleClick() {
    const { data, error } = await BookSlot({ startDateTime });
    if (error) {
      toast.error(error);
    }
    if (data) {
      toast.success("Slot booked");
    }
  }
  return <Button onClick={handleClick}>Book</Button>;
};
