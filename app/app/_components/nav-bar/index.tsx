import { FortyTwoSignIn } from "@/components/auth/fortytwo-sign-in/";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface INavBar {
  className?: string;
}

export const NavBar = ({ className }: INavBar) => {
  return (
    <nav
      className={cn(
        "flex justify-between items-center backdrop-blur-sm p-1 sticky top-0 z-1000 shadow-sm border-b",
        className
      )}
    >
      <div className="flex items-center space-x-4 rounded p-1 pt-0 pb-0 shadow ">
        <Link href="/">
          <span className="text-lg font-bold text-primary tracking-widest hover:text-primary/80 ">
            🔥 Cadet @ 42bangkok.com
          </span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <FortyTwoSignIn />
      </div>
    </nav>
  );
};
