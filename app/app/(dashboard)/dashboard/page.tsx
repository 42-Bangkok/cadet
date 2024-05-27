import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <p>
        <Link href="/">
          <Button>Back to landing page</Button>
        </Link>
      </p>
    </div>
  );
}
