import { BackBtn } from "@/components/back-btn";
import { TypographyH1 } from "@/components/typographies";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <BackBtn />
      <TypographyH1>Staff Dashboard</TypographyH1>
      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/staff/iam">IAM</Link>
        </Button>
        <Button asChild>
          <Link href="/staff/evaluation-slots">Evaluations</Link>
        </Button>
      </div>
    </main>
  );
}
