import { SiteHeader } from "@/components/SiteHeader";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../utils/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMS 1.0",
  description: "Shadcn UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("h-screen bg-background font-sans antialiased", inter)}
      >
        <Providers>
          <div className="relative flex h-full flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
