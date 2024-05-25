import { FortyTwoSignIn } from "@/components/auth/fortytwo-sign-in/";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface INavBar {
  className?: string;
}

export const NavBar = ({ className }: INavBar) => {
  return (
    <nav
      className={cn(
        "flex justify-between items-center backdrop-blur-sm p-1 bg-primary/20 sticky top-0 z-1000 shadow-violet-400 shadow-sm",
        className
      )}
    >
      <div className="flex items-center space-x-4 bg-white rounded p-1 pt-0 pb-0 shadow shadow-violet-300">
        <Link href="/">
          <span className="text-lg font-bold text-primary tracking-widest hover:text-primary/80 ">
            🔥 Cadet @ 42bangkok.com
          </span>
        </Link>
        {/* <a href="/app" className="text-blue-600">
          Dashboard
        </a> */}
      </div>
      <div className="flex items-center space-x-4">
        <FortyTwoSignIn />
      </div>
    </nav>
  );
};
