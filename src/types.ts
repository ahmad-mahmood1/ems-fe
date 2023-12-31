import * as z from "zod";

export const configSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).min(2, {
    message: "Name must be at least 2 characters.",
  }),
  eobi: z
    .string({ required_error: "EOBI Required" })
    .min(1, { message: "Invalid EOBI" })
    .max(5, { message: "EOBI Limit Exceeded" }),
  timeIn: z
    .string({ required_error: "Time required" })
    .refine(
      (val) => !!/([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(val),
      "Invalid time"
    ),
  timeOut: z
    .string({ required_error: "Time required" })
    .refine(
      (val) => !!/([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(val),
      "Invalid time"
    ),
  reportType: z.enum(["attendance", "salary"]),
  dateRange: z.object({
    to: z.date(),
    from: z.date(),
  }),
  month: z.string(),
});

export type ReportGenerationFormValues = z.infer<typeof configSchema>;

export type ReportTypes = "attendance" | "salary";

export type LeaveType = "SL" | "CL" | "AB";

export interface Employee {
  serial_number: string;
  code: string;
  name: string;
  father_name: string;
  address: string;
  designation: string;
  cnic: string;
  doj: Date;
  dol?: Date;
  department: string;
  latest_salary: string;
}

export interface ReportsViewerProps {
  configData: ReportGenerationFormValues;
  employees: Employee[];
  offDays: OffDay[];
}

export interface OffDay {
  code: string;
  name: string;
  leaveType: LeaveType;
  date: Date;
}
