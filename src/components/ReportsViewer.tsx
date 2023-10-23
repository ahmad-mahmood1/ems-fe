"use client";

import { ReportGenerationFormValues } from "@/app/page";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import useIsClient from "@/hooks/useIsClient";
import { useUploadEmployees } from "@/network/api";
import { AttendanceSheet } from "@/pdf-docs/AttendanceSheet";
import { SalarySheet } from "@/pdf-docs/SalarySheet";
import { Employee, ReportTypes } from "@/types";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useCallback, useState } from "react";

const componentHash: Record<
  ReportTypes,
  typeof AttendanceSheet | typeof SalarySheet
> = {
  attendance: AttendanceSheet,
  salary: SalarySheet,
};

type ReportsViewerProps = {
  configData: ReportGenerationFormValues;
};

function ReportsViewer({ configData }: ReportsViewerProps) {
  let { employeeListFile, reportType } = configData;
  const [preview, setPreview] = useState(false);

  const mutation = useUploadEmployees();

  const isClient = useIsClient();
  let Comp = componentHash[reportType];
  let reportName = reportType === "attendance" ? "Attendance" : "Salary Cards";

  let renderReport = useCallback(
    (employees: Employee[]) => {
      return <Comp configData={configData} employees={employees} />;
    },
    [configData, Comp]
  );

  return (
    <div className="my-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex space-x-4">
          <Button
            disabled={mutation.isLoading}
            onClick={() => {
              mutation.error && mutation.reset();
              employeeListFile && mutation.mutate(employeeListFile.file);
            }}
          >
            Generate Report {mutation.isLoading && <Icons.spinner />}
          </Button>

          {isClient && mutation.isSuccess && (
            <>
              <Button asChild>
                <PDFDownloadLink
                  document={renderReport(mutation.data.employees)}
                  fileName={`${reportName}.pdf`}
                >
                  {({ blob, url, loading }) => {
                    return !blob || loading || !url ? (
                      <Icons.spinner />
                    ) : (
                      <Icons.download />
                    );
                  }}
                </PDFDownloadLink>
              </Button>
            </>
          )}
        </div>
        {mutation.isSuccess && (
          <Button
            onClick={() => {
              setPreview((prev) => !prev);
            }}
          >
            Preview
          </Button>
        )}
      </div>
      {preview && isClient && mutation.isSuccess && (
        <PDFViewer className="w-full min-h-screen mt-5">
          {renderReport(mutation.data.employees)}
        </PDFViewer>
      )}
    </div>
  );
}

export default ReportsViewer;
