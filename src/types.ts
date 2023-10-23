export type ReportTypes = "attendance" | "salary";

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
  joining_salary: string;
  latest_salary: string;
}
