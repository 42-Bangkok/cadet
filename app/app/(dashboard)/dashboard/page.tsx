import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <p>
        Thank you for your interest. This feature is under development. <br />
        Meanwhile you please enjoy free short link service without logging in.
        <br />
        <Link href="/">
          <Button>Back to landing page</Button>
        </Link>
      </p>
    </div>
  );
}
