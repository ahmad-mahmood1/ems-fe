import { Employee, OffDay, ReportsViewerProps } from "@/types";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format, getMonth, isBefore, set } from "date-fns";
import { PropsWithChildren } from "react";
import { createTw } from "react-pdf-tailwind";
import { formatNumber } from "../lib/utils";

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

let widthHash: any = {
  0: "30px",
  1: "50px",
  2: "120px",
  3: "150px",
};

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
): [Record<string, any>, Record<string, number>] => {
  let departmentEmployeeHash: Record<string, any[]> = {};
  let eobi = 250;
  let allDepartmentsTotal: Record<string, number> = {
    grossSalary: 0,
    tax: 0,
    eobi: 0,
    otAmount: 0,
    loan: 0,
    otherDed: 0,
    advancedAmount: 0,
    netPay: 0,
  };

  employeeList
    ?.filter((employee) => isBefore(employee.doj, date))
    .forEach((employee: Employee, i: number) => {
      let grossSalary = parseInt(employee.latest_salary || "0");
      let tax = 0;
      let employeeEobi = eobi;
      let ot = 0;
      let otAmount = 0;
      let loan = 0;
      let otherDed = 0;
      let advanceAmount = 0;
      let totalWorkingDays = 26;
      let employeeOffDays = offDays.filter(
        (e) => e.code === employee.code
      ).length;
      let perDayRate = Math.round(grossSalary / totalWorkingDays);
      let netPay = grossSalary - eobi - employeeOffDays * perDayRate;
      let data = {
        name: employee.name,
        designation: employee.designation,
        code: employee.code,
        doj: employee.doj,
        grossSalary,
        days:
          totalWorkingDays -
          offDays.filter((e) => e.code === employee.code).length,
        tax,
        eobi: employeeEobi,
        ot,
        otAmount,
        loan,
        otherDed,
        advanceAmount,
        netPay,
      };

      let employeeDepartment = employee.department.trim();
      if (employeeDepartment) {
        if (!departmentEmployeeHash[employeeDepartment]) {
          departmentEmployeeHash[employeeDepartment] = [data];
        } else {
          departmentEmployeeHash[employeeDepartment].push(data);
        }
        allDepartmentsTotal.grossSalary =
          allDepartmentsTotal.grossSalary + grossSalary;
        allDepartmentsTotal.tax = allDepartmentsTotal.tax + tax;
        allDepartmentsTotal.eobi = allDepartmentsTotal.eobi + eobi;
        allDepartmentsTotal.ot = allDepartmentsTotal.ot + ot;
        allDepartmentsTotal.otAmount = allDepartmentsTotal.otAmount + otAmount;
        allDepartmentsTotal.loan = allDepartmentsTotal.loan + loan;
        allDepartmentsTotal.netPay = allDepartmentsTotal.netPay + netPay;
      }
    });

  return [departmentEmployeeHash, allDepartmentsTotal];
};

export const SalarySheet: React.FC<ReportsViewerProps & PropsWithChildren> = ({
  configData,
  employees,
  offDays,
}: ReportsViewerProps & PropsWithChildren) => {
  let { name, month } = configData;

  const date = set(new Date(), { month: parseInt(month) });
  const [employeeDepartmentHash, allDepartmentsTotal] = groupDataByDepartment(
    employees.slice(1),
    date,
    offDays.filter(
      (offDay) =>
        getMonth(offDay.date) === getMonth(date) && offDay.leaveType === "AB"
    )
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
        <StatsRow
          data={allDepartmentsTotal}
          isTotal={true}
        />
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

  return (
    <View>
      <View
        style={[
          tw("border-2 border-zinc-300 font-timesBold"),
          { backgroundColor: "#9ec8cf" },
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
                { backgroundColor: "#f6f4ea" },
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
      <View
        style={[styles.tableRow, { height: "40px" }]}
        key={i}
      >
        <TableCol
          customStyle={{ width: widthHash[0] }}
          str={(i + 1).toString()}
        />
        <TableCol
          str={employee.code}
          customStyle={{ width: widthHash[1] }}
          disableNumberFormat={true}
        />
        <TableCol
          str={employee.name}
          customStyle={{ width: widthHash[2] }}
        />
        <TableCol
          str={employee.designation}
          customStyle={{ width: widthHash[3] }}
        />
        <TableCol
          str={format(employee.doj, "dd-MMM-yyyy")}
          disableNumberFormat={true}
        />
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
  str,
  customStyle = {},
  disableNumberFormat = false,
}: {
  str?: string | number;
  customStyle?: any;
  disableNumberFormat?: boolean;
}) {
  let newString;
  if (typeof str === "number") {
    let textToNumber = (str: number) =>
      disableNumberFormat ? str : formatNumber(str);
    newString = textToNumber(str);
  } else {
    newString = str ? str : "";
  }

  return (
    <View style={[styles.tableCol, customStyle]}>
      <View style={styles.tableCell}>
        <Text>{newString}</Text>
      </View>
    </View>
  );
}

function StatsRow({ data, isTotal = false }: { data: any; isTotal?: boolean }) {
  return (
    <View
      style={[
        styles.tableRow,
        { backgroundColor: isTotal ? "#fffa" : "#c3d5f5" },
        tw("border border-zinc-300 font-timesBold"),
      ]}
    >
      <TableCol />
      <TableCol />
      <TableCol />
      <TableCol
        str={isTotal ? "All Deaprtment Total:" : "Deaprtment Total:"}
        customStyle={{ width: "150px" }}
      />
      <TableCol />
      <TableCol str={data.grossSalary} />
      <TableCol />
      <TableCol />
      <TableCol str={data.otAmount} />
      <TableCol str={data.eobi} />
      <TableCol str={data.tax} />
      <TableCol str={data.loan} />
      <TableCol str={data.otherDed} />
      <TableCol str={data.advancedPayment} />
      <TableCol str={data.netPay} />
      <TableCol />
    </View>
  );
}
