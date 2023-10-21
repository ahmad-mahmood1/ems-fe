"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { HomeIcon } from "@radix-ui/react-icons";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <HomeIcon className="font-medium text-slate-900" />
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/company"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/company" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Company
        </Link>
        <Link
          href="/employee/reports"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/employee/reports")
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          Employees
        </Link>
      </nav>
    </div>
  );
}
