"use client";

import { ReportGenerationFormValues } from "@/app/page";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AttendanceSheet } from "@/pdf-docs/AttendanceSheet";
import { SalarySheet } from "@/pdf-docs/SalarySheet";
import { Employee, ReportTypes } from "@/types";
import { PDFViewer, usePDF } from "@react-pdf/renderer";
import { useCallback, useState } from "react";
import Loader from "./ui/loader";

const componentHash: Record<
  ReportTypes,
  typeof AttendanceSheet | typeof SalarySheet
> = {
  attendance: AttendanceSheet,
  salary: SalarySheet,
};

type ReportsViewerProps = {
  configData: ReportGenerationFormValues;
  employees: Employee[];
};

function ReportsViewer({ configData, employees }: ReportsViewerProps) {
  let { reportType } = configData;
  let Comp = componentHash[reportType];
  let renderReport = useCallback(() => {
    return <Comp configData={configData} employees={employees} />;
  }, [configData, Comp, employees]);

  const [preview, setPreview] = useState(false);

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
            update(renderReport());
          }}
        >
          Generate Report
        </Button>

        <div className="flex items-center space-x-4">
          <Button
            asChild
            className={cn(disableResource && "opacity-50 pointer-events-none")}
          >
            <a href={url || ""} download={`${reportName}.pdf`}>
              {loading ? <Loader /> : <Icons.download />}
            </a>
          </Button>
          <Button
            disabled={disableResource}
            onClick={() => {
              setPreview((prev) => !prev);
            }}
          >
            Preview
          </Button>
        </div>
      </div>
      {preview && (
        <PDFViewer className="w-full min-h-screen mt-5" >
          {renderReport()}
        </PDFViewer>
      )}
    </div>
  );
}

export default ReportsViewer;
