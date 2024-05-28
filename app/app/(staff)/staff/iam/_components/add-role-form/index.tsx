import { db } from "@/lib/db/clients";
import { RoleForm } from "./role-form";

export const AddRoleForm = async () => {
  const roles = await db.query.roles.findMany();
  return <RoleForm roles={roles} />;
};
