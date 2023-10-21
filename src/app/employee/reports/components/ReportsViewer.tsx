"use client";

import { Button } from "@/components/ui/button";
import useIsClient from "@/hooks/useIsClient";
import { useGetCopmanyDetails, useGetEmployees } from "@/network/api";
import { AttendanceSheet } from "@/pdf-docs/AttendanceSheet";
import { SalarySheet } from "@/pdf-docs/SalarySheet";
import { PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";

const componentHash: Record<string, any> = {
  attendance: AttendanceSheet,
  salary: SalarySheet,
};

function ReportsViewer() {
  const isClient = useIsClient();
  const [doc, setDoc] = useState<string>("attendance");
  const {
    data: { employees },
  } = useGetEmployees();
  console.log("===  employees:", employees);
  const {
    data: { company: companyDetails },
  } = useGetCopmanyDetails();
  console.log("===  companyDetails:", companyDetails);

  let Comp = componentHash[doc];

  const handleDocChange = (str: string) => {
    setDoc(str);
  };

  return (
    <div className="flex flex-row h-full p-2">
      <aside className="w-48">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Documents
          </h2>
          <div className="space-y-1">
            <Button
              variant={doc === "attendance" ? "secondary" : "ghost"}
              onClick={() => {
                handleDocChange("attendance");
              }}
              className="w-full justify-start"
            >
              Attendance Report
            </Button>
            <Button
              variant={doc === "salary" ? "secondary" : "ghost"}
              onClick={() => {
                handleDocChange("salary");
              }}
              className="w-full justify-start"
            >
              Salary Cards
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        {isClient && (
          <PDFViewer className="h-full w-full">
            <Comp employees={employees} companyDetails={companyDetails} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}

export default ReportsViewer;
