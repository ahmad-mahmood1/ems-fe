import { NextResponse } from "next/server";

let companyDetails: any = {
  name: "AL HASAN",
  timeIn: "09:00",
  timeOut: "18:00",
};

export async function GET(req: Request) {
  let fetchCompanyDetails = () =>
    new Promise((r) => setTimeout(() => r(companyDetails), 100));

  let data = await fetchCompanyDetails();

  return NextResponse.json({ companyDetails: data }, { status: 200 });
}

export async function POST(req: Request) {
  const data = await req.json();

  companyDetails = data;
  return NextResponse.json({ companyDetails }, { status: 200 });
}
