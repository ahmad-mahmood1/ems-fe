import { ReportGenerationFormValues } from "@/app/page";
import { generateRandomNumberBetweenRange } from "@/lib/utils";
import { Employee } from "@/types";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  add,
  differenceInDays,
  format,
  intervalToDuration,
  isAfter,
  isBefore,
  max,
  min,
  set,
  sub
} from "date-fns";
import moment from "moment";
import React, { PropsWithChildren } from "react";
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
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});

const styles = StyleSheet.create({
  rowView: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid #EEE",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 3,
    paddingRight: 3,
    textAlign: "left",
  },
  colItem: {
    flexBasis: 0,
    flexGrow: 1,
  },

  sunday: {
    backgroundColor: "grey",
    border: 0,
  },
});

type AttendanceSheetProps = {
  configData: ReportGenerationFormValues;
  employees: Employee[];
} & PropsWithChildren;

type TableDataProps = {
  startDate: Date;
  endDate: Date;
  timeIn: string;
  timeOut: string;
};

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  configData,
  employees,
}) => {
  let { timeIn, timeOut, name, dateRange } = configData;
  const employeeData = employees.slice(1);

  return (
    <Document title="Attendance">
      {employeeData.map((employee: Employee, i: number) => {

        let startDate, endDate;
        let invalidRange =
          isBefore(dateRange.to, employee.doj) ||
          (employee.dol ? isAfter(dateRange.from, employee.dol) : false);

        if (invalidRange) {
          startDate = new Date();
          endDate = new Date();
        } else {
          startDate = max([employee.doj, dateRange.from]);
          endDate = employee.dol
            ? min([employee.dol, dateRange.to])
            : dateRange.to;
        }

        return (
          <Page
            size="A4"
            style={tw("p-10 text-sm font-timesRoman")}
            key={"emp" + i}
          >
            <Text style={tw("mb-1 font-timesBold")}>{name}</Text>
            <Text style={[tw("mb-3 font-timesBold"), { fontWeight: 2 }]}>
              Attendance card for {format(dateRange.from, "dd MMM - yy")} -{" "}
              {format(dateRange.to, "dd MMM - yy")}
            </Text>
            <EmployeeDetailBar employeeData={employee} />
            <EmployeeAttendanceTable
              startDate={startDate}
              endDate={endDate}
              timeIn={timeIn}
              timeOut={timeOut}
            />
          </Page>
        );
      })}
    </Document>
  );
};

function EmployeeDetailBar({ employeeData }: { employeeData: Employee }) {
  return (
    <View style={tw("flex flex-row justify-between pr-10")}>
      <View style={tw("flex flex-row")}>
        <View style={tw("mr-2")}>
          <Text>Emp Code</Text>
          <Text>Name</Text>
        </View>
        <View style={tw("font-timesBold")}>
          <Text>{employeeData?.code}</Text>
          <Text>{employeeData?.name}</Text>
        </View>
      </View>

      <View style={tw("flex flex-row")}>
        <View style={tw("mr-2")}>
          <Text>Designation</Text>
          <Text>Section</Text>
        </View>
        <View>
          <Text>{employeeData?.designation}</Text>
          <Text>{employeeData?.department}</Text>
        </View>
      </View>

      <View style={tw("flex flex-row")}>
        <View style={tw("mr-2")}>
          <Text>D O J</Text>
          <Text>Overtime</Text>
        </View>
        <View>
          <Text>{moment(employeeData.doj).format("DD-MM-YYYY")}</Text>
          <Text>00:00</Text>
        </View>
      </View>
    </View>
  );
}

function EmployeeAttendanceTable({
  startDate,
  endDate,
  timeIn,
  timeOut,
}: TableDataProps) {
  let columns = [
    "Srl #",
    "Day",
    "Closing Date",
    "Time In",
    "Time Out",
    "Tot Time",
    "Over time",
    "Attendance",
  ];

  return (
    <View style={tw("mt-2")}>
      <View style={styles.rowView}>
        {columns?.map((c: string) => (
          <Text key={c} style={[styles.colItem, tw("font-timesBold")]}>
            {c}
          </Text>
        ))}
      </View>
      <EmployeeRows
        startDate={startDate}
        endDate={endDate}
        timeIn={timeIn}
        timeOut={timeOut}
      />
    </View>
  );
}

function EmployeeRows({ startDate, endDate, timeIn, timeOut }: TableDataProps) {
  let data: any = [];
  let days = differenceInDays(endDate, startDate);
  let stats: any = {
    PP: days,
    AB: 0,
    LW: 0,
    GH: 0,
    WE: 0,
    Days: days,
    "O/T": "00:00",
    "Earn days": days,
  };

  [...Array(days)].forEach((_, i: number) => {
    let currentDate = set(startDate, { date: i + 1 });
    let isPublicHoldiay = false;
    let day = format(currentDate, "iii");
    let closingDate = format(currentDate, "dd-MMM-yyyy");

    let employeeObject = {
      srl: i,
      day,
      closingDate,
      timeIn: "",
      timeOut: "",
      totalTime: "",
      overTime: "",
      attendance: "PP",
    };

    if (day !== "Sun" && !isPublicHoldiay) {
      let startTime = sub(
        set(new Date(), {
          hours: parseInt(timeIn.split(":")[0]),
          minutes: parseInt(timeIn.split(":")[1]),
        }),
        { minutes: generateRandomNumberBetweenRange(0, 8) }
      );
      let endTime = add(
        set(new Date(), {
          hours: parseInt(timeOut.split(":")[0]),
          minutes: parseInt(timeOut.split(":")[1]),
        }),
        { minutes: generateRandomNumberBetweenRange(2, 5) }
      );

      let totalTime = intervalToDuration({ start: startTime, end: endTime });

      employeeObject.timeIn = format(startTime, "HH:mm");
      employeeObject.timeOut = format(endTime, "HH:mm");
      employeeObject.totalTime = `${totalTime.hours}:${totalTime.minutes}`;
    }

    // let row = [];

    if (employeeObject.day === "Sun") {
      employeeObject.attendance = "SN";
      stats.WE += 1;
      stats.PP -= 1;
    }

    if (isPublicHoldiay) {
      employeeObject.attendance = "GH";
      stats.GH += 1;
      stats.PP -= 1;
    }

    if (employeeObject.attendance === "AB") {
      stats.PP -= 1;
      stats["Earn days"] -= 1;
    }

    data.push(employeeObject);
  });

  let rows = data?.map((item: any, i: number) => {
    let style: any[] = [styles.rowView];

    if (item.day === "Sun") {
      style = style.concat(styles.sunday);
    }

    return (
      <View style={style} key={item.srl}>
        <Text style={styles.colItem}>{item.srl}</Text>
        <Text
          style={[styles.colItem, item.day === "Sun" ? { color: "red" } : {}]}
        >
          {item.day}
        </Text>
        <Text style={styles.colItem}>{item.closingDate}</Text>
        <Text style={styles.colItem}>{item.timeIn}</Text>
        <Text style={styles.colItem}>{item.timeOut}</Text>
        <Text style={styles.colItem}>{item.totalTime}</Text>
        <Text style={styles.colItem}>{item.overTime}</Text>
        <Text style={styles.colItem}>{item.attendance}</Text>
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

function StatsRow({ data }: { data: any }) {
  return (
    <View
      style={[
        styles.rowView,
        {
          border: "1px solid black",
          padding: "5 4 5 4",
          justifyContent: "space-between",
        },
      ]}
    >
      {Object.keys(data).map((key) => (
        <View key={key}>
          <View>
            <Text>
              {key} : {data[key]}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
