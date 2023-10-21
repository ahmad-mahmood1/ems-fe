import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/company/components/SidebarNav";

export const metadata: Metadata = {
  title: "Company Settings",
  description: "Update your company settings",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/company",
  },
  {
    title: "Employees",
    href: "/company/employees",
  },
];

interface CompanySetttingsLayoutProps {
  children: React.ReactNode;
}

export default function CompanySetttingsLayout({
  children,
}: CompanySetttingsLayoutProps) {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block ">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your company settings</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
