import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import FortyTwo from "next-auth/providers/42-school";
import { db } from "@/lib/db/clients";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [FortyTwo],
});
