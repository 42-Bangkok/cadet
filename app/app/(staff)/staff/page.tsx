import { BackBtn } from "@/components/back-btn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <BackBtn />
      <p>Staff page</p>
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
