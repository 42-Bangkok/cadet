import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FtApi } from "@/lib/42";
import { Xmark } from "iconoir-react";
import { removeEvaluatee } from "./actions";
import { toast } from "sonner";
import { RemoveBtn } from "./delete-btn";

interface IIntraAvatar {
  login: string;
  evaluateeId: string;
  isTeamLeader: boolean;
}

export const IntraAvatar = async (p: IIntraAvatar) => {
  const ftApi = new FtApi();
  const user = await ftApi.getUserById({ id: p.login });
  const src = user.image.link;
  return (
    <div className="relative">
      <Avatar className="min-h-24 min-w-24 shadow-md">
        <AvatarImage src={src} alt={user.login} />
        <AvatarFallback>{user.login}</AvatarFallback>
      </Avatar>
      {!p.isTeamLeader && <RemoveBtn id={p.evaluateeId} />}
    </div>
  );
};

IntraAvatar.Skeleton = function Skeleton() {
  return (
    <Avatar className="min-h-24 min-w-24 shadow-md">
      <AvatarFallback>loading</AvatarFallback>
    </Avatar>
  );
};
