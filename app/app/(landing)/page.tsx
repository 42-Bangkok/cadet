import Link from "next/link";
import { LandingBody } from "./_components/landing-body";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { hasAnyRole } from "@/lib/rbac/core";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const isStaff = await hasAnyRole({
    email: session!.user!.email as string,
    roles: ["staff"],
  });
  const isTutor = await hasAnyRole({
    email: session!.user!.email as string,
    roles: ["tutor"],
  });
  if (!isStaff && !isTutor) {
    return redirect("/dashboard");
  }
  return (
    <main className="flex flex-col gap-4">
      <LandingBody />
      {isStaff && (
        <Button asChild>
          <Link href="/staff/iam">Staff IAM</Link>
        </Button>
      )}
      {isTutor && (
        <Button asChild>
          <Link href="/tutor">Tutor Dashboard</Link>
        </Button>
      )}
      <Button asChild>
        <Link href="/dashboard">Cadet Dashboard</Link>
      </Button>
    </main>
  );
}
