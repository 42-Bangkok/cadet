import { FtApi } from "@/lib/42";
import { SelectForm } from "./select-form";

interface IProjectSelectForm {
  userId: string;
  project: string | null;
  evaluationSlotId: string;
}

export const ProjectSelectForm = async (p: IProjectSelectForm) => {
  const ftApi = new FtApi();
  const user = await ftApi.getUserById({ id: p.userId });
  let selects = user.projects_users.filter((p: any) => p.status != "finished");
  selects = selects.map((p: any) => ({
    label: p.project.name,
    value: p.project.name,
  }));

  return (
    <SelectForm
      selects={selects}
      project={p.project}
      evaluationSlotId={p.evaluationSlotId}
    />
  );
};
