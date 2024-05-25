import { auth } from "@/auth";
import { SignIn, SignOut } from "./btns";

export async function FortyTwoSignIn() {
  const session = await auth();
  return session ? <SignOut /> : <SignIn />;
}
