import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { NavBar } from "./_components/nav-bar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "42 Bangkok Cadet Portal",
  description: "42 Bangkok Cadet Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "h-dvh p-0")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar className="mb-4 z-50" />
          <div className="pl-4 pr-4">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
