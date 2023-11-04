import { OffDay } from "@/types";
import { NextResponse } from "next/server";
import { WorkSheet, read, utils } from "xlsx";

export async function POST(req: Request) {
  const data = await req.arrayBuffer();
  const wb = read(data, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0] as string] as WorkSheet;
  let header: Array<keyof OffDay> = ["code", "name", "leaveType", "date"];
  const worksheetToJson: OffDay[] = utils.sheet_to_json(ws, {
    header,
    defval: null,
    blankrows: false,
  }); // generate objects

  let employeesOffDays = [...worksheetToJson.slice(1)];

  return NextResponse.json({ employeesOffDays }, { status: 200 });
}
