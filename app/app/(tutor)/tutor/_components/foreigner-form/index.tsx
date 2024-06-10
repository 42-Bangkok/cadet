import { SwitchForm } from "./form-switch";

interface IForeignerForm {
  id: string;
  foreigner: boolean;
}

export const ForeignerForm = (p: IForeignerForm) => {
  return <SwitchForm id={p.id} foreigner={p.foreigner} />;
};
