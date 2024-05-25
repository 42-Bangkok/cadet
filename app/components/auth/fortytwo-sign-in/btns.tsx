"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "../../ui/button";
import Image from "next/image";

export const SignIn = () => {
  return (
    <Button
      onClick={() =>
        signIn("42-school", {
          callbackUrl: "/",
        })
      }
    >
      <div className="flex gap-2">
        <Image
          src="/icon/42_Logo.svg"
          width={20}
          height={20}
          alt="google icon"
        />
        Sign In
      </div>
    </Button>
  );
};

export const SignOut = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
    >
      Sign Out
    </Button>
  );
};
