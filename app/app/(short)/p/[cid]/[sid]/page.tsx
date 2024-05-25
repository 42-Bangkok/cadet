export default function Page({
  params,
}: {
  params: { cid: string; sid: string };
}) {
  return (
    <p>
      {params.cid} {params.sid}
    </p>
  );
}
