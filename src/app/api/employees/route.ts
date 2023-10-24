import { Employee } from "@/types";
import { NextResponse } from "next/server";
import { WorkSheet, read, utils } from "xlsx";

const nums: Set<number> = new Set();
while (nums.size !== 5000) {
  nums.add(Math.floor(Math.random() * (612345 - 223010)) + 223010);
}

let randomIds = [...nums];

export async function POST(req: Request) {
  const data = await req.arrayBuffer();
  const wb = read(data, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0] as string] as WorkSheet;
  let header = [
    "serial_number",
    "code",
    "name",
    "father_name",
    "address",
    "designation",
    "cnic",
    "doj",
    "dol",
    "department",
    "joining_salary",
    "latest_salary",
  ];
  const worksheetToJson: Employee[] = utils.sheet_to_json(ws, {
    header,
    defval: null,
    blankrows: false,
  }); // generate objects

  let employeesList = [
    header.reduce((prev, curr) => ({ ...prev, [curr]: curr }), {}),
    ...worksheetToJson
      .filter((row) => !!row.cnic && !!row.doj)
      .slice(1)
      .map((e, i) => ({ ...e, code: randomIds[i] })),
  ];

  return NextResponse.json({ employees: employeesList }, { status: 200 });
}
