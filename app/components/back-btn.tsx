"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FastArrowLeft } from "iconoir-react";
import { cn } from "@/lib/utils";

export const BackBtn = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) => {
  const router = useRouter();
  return (
    <Button
      className={cn("max-w-20 pl-4 pr-6", className)}
      onClick={() => router.back()}
    >
      {children || (
        <div className="flex gap-1">
          <FastArrowLeft /> Back
        </div>
      )}
    </Button>
  );
};
