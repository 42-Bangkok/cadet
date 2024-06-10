import { cn } from "@/lib/utils";

export function TypographyH1({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
}
