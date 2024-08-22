import { FortyTwoSignIn } from "@/components/auth/fortytwo-sign-in";
import { TypographyH1 } from "@/components/typographies";

export default function Page() {
  return (
    <main className="flex flex-col gap-4">
      <TypographyH1>Login</TypographyH1>
      <FortyTwoSignIn />
    </main>
  );
}
