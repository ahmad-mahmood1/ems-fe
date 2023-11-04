import { Employee, OffDay, ReportsViewerProps } from "@/types";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format, isBefore, set } from "date-fns";
import { PropsWithChildren } from "react";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    fontFamily: {
      timesRoman: ["Times-Roman"],
      timesBold: ["Times-Bold"],
    },
    fontSize: {
      sm: "0.8rem",
    },
    extend: {},
  },
});

const COLN_WIDTH = 100 / 16;
const styles = StyleSheet.create({
  table: {
    width: "auto",
  },
  tableRow: {
    // margin: "auto",
    flexDirection: "row",
    borderTop: "1px solid #EEE",
    borderLeft: "1px solid #EEE",
    borderRight: "1px solid #EEE",
  },

  tableCol: {
    width: COLN_WIDTH + "%",
  },
  tableCell: {
    padding: 5,
    textAlign: "center",
  },
});

const groupDataByDepartment = (
  employeeList: Employee[],
  date: Date,
  offDays: OffDay[]
) => {
  let departmentEmployeeHash: Record<string, any[]> = {};
  let eobi = 250;

  employeeList
    ?.filter((employee) => isBefore(employee.doj, date))
    .forEach((employee: Employee, i: number) => {
      let grossSalary = parseInt(
        employee.latest_salary || employee.joining_salary
      );
      let data = {
        name: employee.name,
        designation: employee.designation,
        code: employee.code,
        doj: employee.doj,
        grossSalary,
        days: 26 - offDays.filter((e) => e.code === employee.code).length,
        tax: "-",
        eobi,
        ot: "-",
        otAmount: "-",
        loan: "-",
        otherDed: "-",
        advanceAmount: "-",
        netPay: grossSalary - eobi,
      };
      if (employee.department) {
        if (!departmentEmployeeHash[employee.department]) {
          departmentEmployeeHash[employee.department] = [data];
        } else {
          departmentEmployeeHash[employee.department].push(data);
        }
      }
    });

  return departmentEmployeeHash;
};

export const SalarySheet: React.FC<ReportsViewerProps & PropsWithChildren> = ({
  configData,
  employees,
  offDays,
}: ReportsViewerProps & PropsWithChildren) => {
  let { name, month } = configData;

  const date = set(new Date(), { month: parseInt(month) });
  const employeeDepartmentHash = groupDataByDepartment(
    employees.slice(1),
    date,
    offDays
  );
  const formattedMonth = format(date, "MMM - yy");

  return (
    <Document title="Salary Sheet">
      <Page
        size="A3"
        style={tw("p-10 text-sm font-timesRoman")}
        orientation="landscape"
      >
        <Text style={tw("mb-1 font-timesBold")}>{name}</Text>
        <Text style={[tw("mb-3 font-timesBold"), { fontWeight: 2 }]}>
          Salary sheet for the month {formattedMonth}
        </Text>
        {Object.keys(employeeDepartmentHash)
          .sort((a, b) => a.localeCompare(b))
          .map((departmentKey: string, i: number) => (
            <SalariesByDepartmentTable
              key={"dep" + i}
              employees={employeeDepartmentHash[departmentKey]}
              department={departmentKey}
            />
          ))}
      </Page>
    </Document>
  );
};

function SalariesByDepartmentTable({
  employees,
  department,
}: {
  employees: any[];
  department: string;
}) {
  let columns = [
    "Srl #",
    "E-Code",
    "Name",
    "Designation",
    "DOJ",
    "Gross Salary",
    "Days",
    "O/T",
    "O/T Amount",
    "EOBI",
    "Tax",
    "Loan",
    "Other ded.",
    "Advance Amount",
    "Net Pay",
    "Receipent Signature",
  ];

  let widthHash: any = {
    0: "30px",
    1: "30px",
    2: "120px",
    3: "100px",
  };

  return (
    <View wrap={false}>
      <View
        style={[
          tw("border-2 border-zinc-300 font-timesBold"),
          { padding: "2 3 2 3" },
        ]}
      >
        <Text>{department}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {columns?.map((c: string, i: number) => (
            <View
              key={i}
              style={[
                styles.tableCol,
                tw("font-timesBold"),
                !!widthHash[i] ? { width: widthHash[i] } : {},
              ]}
            >
              <View style={styles.tableCell}>
                <Text>{c}</Text>
              </View>
            </View>
          ))}
        </View>
        <EmployeeRows employees={employees} />
      </View>
    </View>
  );
}

function EmployeeRows({
  employees,
}: {
  employees: Employee[];
} & PropsWithChildren) {
  let stats: any = {
    grossSalary: 0,
    otAmount: 0,
    eobi: 0,
    tax: 0,
    loan: 0,
    otherDed: 0,
    advancedPayment: 0,
    netPay: 0,
  };

  let rows = employees.map((employee: any, i: number) => {
    let grossSalary = employee.grossSalary || 0;
    let eobi = employee.eobi;

    let netPay = grossSalary - eobi;

    stats.grossSalary += grossSalary;
    stats.eobi += eobi;
    stats.netPay += netPay;

    return (
      <View style={styles.tableRow} key={i}>
        <TableCol customStyle={{ width: "30px" }} str={(i + 1).toString()} />
        <TableCol str={employee.code} customStyle={{ width: "30px" }} />
        <TableCol str={employee.name} customStyle={{ width: "120px" }} />
        <TableCol str={employee.designation} customStyle={{ width: "100px" }} />
        <TableCol str={format(employee.doj, "dd-MMM-yyyy")} />
        <TableCol str={employee.grossSalary} />
        <TableCol str={employee.days} />
        <TableCol str={employee.ot} />
        <TableCol str={employee.otAmount} />
        <TableCol str={employee.eobi} />
        <TableCol str={employee.tax} />
        <TableCol str={employee.loan} />
        <TableCol str={employee.otherDed} />
        <TableCol str={employee.advanceAmount} />
        <TableCol str={employee.netPay} />
        <TableCol str={""} />
      </View>
    );
  });

  return (
    <>
      {rows}
      <StatsRow data={stats} />
    </>
  );
}

function TableCol({
  str = "",
  customStyle = {},
}: {
  str?: string;
  customStyle?: any;
}) {
  return (
    <View style={[styles.tableCol, customStyle]}>
      <View style={styles.tableCell}>
        <Text>{str}</Text>
      </View>
    </View>
  );
}

function StatsRow({ data }: { data: any }) {
  return (
    <View
      style={[styles.tableRow, tw("border border-zinc-300 font-timesBold")]}
    >
      <TableCol />
      <TableCol />
      <TableCol />
      <TableCol str={"Departments Total:"} />
      <TableCol />
      <TableCol str={data.grossSalary} />
      <TableCol />
      <TableCol />
      <TableCol str={data.otAmount} />
      <TableCol str={data.eobi} />
      <TableCol str={data.tax ? data.tax : "-"} />
      <TableCol str={data.loan ? data.loan : "-"} />
      <TableCol str={data.otherDed ? data.loan : "-"} />
      <TableCol str={data.advancedPayment ? data.advancedPayment : "-"} />
      <TableCol str={data.netPay} />
      <TableCol />
    </View>
  );
}
