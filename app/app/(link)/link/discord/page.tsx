import { DiscordLinkForm } from "./_components/discord-link-form";
import { StoreHandler } from "./_components/store-handler";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const token = (searchParams.token as string) || "";
  return (
    <>
      <DiscordLinkForm token={token} />
      <StoreHandler token={token} />
    </>
  );
}
