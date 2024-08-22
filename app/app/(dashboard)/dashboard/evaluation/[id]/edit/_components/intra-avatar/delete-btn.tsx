"use client";

import { Button } from "@/components/ui/button";
import { Xmark } from "iconoir-react";
import { removeEvaluatee } from "./actions";
import { toast } from "sonner";

interface IDeleteBtn {
  id: string;
}

export const RemoveBtn = ({ id }: IDeleteBtn) => {
  async function handleRemove() {
    const { data, error } = await removeEvaluatee({
      evaluateeId: id,
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Evaluatee removed");
  }
  return (
    <Button
      variant={"ghost"}
      className="absolute top-0 right-0 m-0 p-0"
      onClick={() => handleRemove()}
    >
      <Xmark width={32} height={32} color="red" strokeWidth={4} />
    </Button>
  );
};
