"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttendanceSheet } from "@/pdf-docs/AttendanceSheet";
import { SalarySheet } from "@/pdf-docs/SalarySheet";
import {
  Employee,
  OffDay,
  ReportGenerationFormValues,
  ReportTypes,
  ReportsViewerProps,
} from "@/types";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import Loader from "./ui/loader";

const componentHash: Record<
  ReportTypes,
  typeof AttendanceSheet | typeof SalarySheet
> = {
  attendance: AttendanceSheet,
  salary: SalarySheet,
};

function renderDocument(
  configData: ReportGenerationFormValues,
  employees: Employee[],
  offDays: OffDay[]
) {
  let Comp = componentHash[configData.reportType];

  return (
    <Comp
      configData={configData}
      employees={employees}
      offDays={offDays}
    />
  );
}

function ReportsViewer({ configData, employees, offDays }: ReportsViewerProps) {
  let { reportType } = configData;

  const [{ loading, url, error }, update] = usePDF({
    document: undefined,
  });

  let disableResource = loading || !!error || !url;

  let reportName = reportType === "attendance" ? "Attendance" : "Salary Cards";

  return (
    <div className="my-4">
      <div className="w-full flex items-center justify-between">
        <Button
          onClick={() => {
            update(renderDocument(configData, employees, offDays));
          }}
        >
          Generate Report
        </Button>

        <Button
          asChild
          className={cn(disableResource && "opacity-50 pointer-events-none")}
        >
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : (
            <a
              href={url || ""}
              download={`${reportName}.pdf`}
            >
              <Icons.download />
            </a>
          )}
        </Button>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ReportsViewer), { ssr: false });
