import { auth } from "@/auth";
import { DiscordLinkForm } from "./_components/discord-link-form";
import { StoreHandler } from "./_components/store-handler";
import { SignIn } from "@/components/auth/fortytwo-sign-in/btns";
import { TypographyH1 } from "@/components/typographies";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const token = (searchParams.token as string) || "";
  if (session?.user) {
    return <DiscordLinkForm token={token} />;
  }
  return (
    <div>
      <TypographyH1>Sign in to link your Discord account</TypographyH1>
      <SignIn callbackUrl="/link/discord" />
      <StoreHandler token={token} />
    </div>
  );
}
