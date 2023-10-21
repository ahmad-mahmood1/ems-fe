"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { COMPANY_ROUTE, EMPLOYEE_REPORT_ROUTE } from "@/constants/route";
import { useRouter } from "next/navigation";

export function MenuBar() {
  const router = useRouter();
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Company</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => {
              router.push(COMPANY_ROUTE);
            }}
          >
            Settings
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Employee</MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => {
              router.push(EMPLOYEE_REPORT_ROUTE);
            }}
          >
            Reports
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
