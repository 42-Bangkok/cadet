import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FtApi } from "@/lib/42";

export const IntraAvatar = async (p: { login: string }) => {
  const ftApi = new FtApi();
  const user = await ftApi.getUserById({ id: p.login });
  const src = user.image.link;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <Avatar className="min-h-24 min-w-24 shadow-md">
      <AvatarImage src={src} alt={user.login} />
      <AvatarFallback>{user.login}</AvatarFallback>
    </Avatar>
  );
};

IntraAvatar.Skeleton = function Skeleton() {
  return (
    <Avatar className="min-h-24 min-w-24 shadow-md">
      <AvatarFallback>loading</AvatarFallback>
    </Avatar>
  );
};
