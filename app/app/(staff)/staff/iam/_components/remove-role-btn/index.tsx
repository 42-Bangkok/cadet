"use client";

import { toast } from "sonner";
import { removeRole } from "./actions";
import { Button } from "@/components/ui/button";
import { TrashSolid } from "iconoir-react";

interface IRemoveRoleBtn {
  userId: string;
  roleId: string;
}

export const RemoveRoleBtn = (p: IRemoveRoleBtn) => {
  async function handleClick() {
    const { data, error } = await removeRole(p);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Role removed");
  }
  return (
    <Button type="button" variant={"ghost"} onClick={handleClick}>
      <TrashSolid color="red" />
    </Button>
  );
};
