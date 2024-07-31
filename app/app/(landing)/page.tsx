import Link from "next/link";
import { LandingBody } from "./_components/landing-body";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="flex flex-col gap-2">Placeholder</div>
      </div>
      <LandingBody />
      temp
      <Link href="/staff/iam">Staff IAM</Link>
      <Link href="/tutor">Tutor Dashboard</Link>
      <Link href="/dashboard">Cadet Dashboard</Link>
    </main>
  );
}
