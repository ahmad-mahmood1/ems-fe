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
  format,
  getDaysInMonth,
  intervalToDuration,
  set,
  sub,
} from "date-fns";
import React, { PropsWithChildren } from "react";
import { createTw } from "react-pdf-tailwind";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

// The 'theme' object is your Tailwind theme config
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
  employees: string[][];
  companyDetails: any;
  selectedMonth?: number;
} & PropsWithChildren;

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({
  employees,
  companyDetails,
  selectedMonth = 7,
}) => {
  const employeeData = employees.slice(1);
  const date = set(new Date(), { month: selectedMonth });
  const formattedMonth = format(date, "MMM - yy");
  return (
    <Document title="Attendance">
      {employeeData.map((employee: any, i: number) => (
        <Page
          size="A4"
          style={tw("p-10 text-sm font-timesRoman")}
          wrap={false}
          key={"emp" + i}
        >
          <Text style={tw("mb-1 font-timesBold")}>{companyDetails?.name}</Text>
          <Text style={[tw("mb-3 font-timesBold"), { fontWeight: 2 }]}>
            Attendance card for the month {formattedMonth}
          </Text>
          <EmployeeDetailBar employeeData={employee} />
          <EmployeeAttendanceTable
            date={date}
            timeIn={companyDetails.timeIn}
            timeOut={companyDetails.timeOut}
          />
        </Page>
      ))}
    </Document>
  );
};

function EmployeeDetailBar({ employeeData }: { employeeData: any }) {
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
          {employeeData?.doj && (
            <Text>{format(new Date(employeeData?.doj), "dd-MMM-yyyy")}</Text>
          )}
          <Text>00:00</Text>
        </View>
      </View>
    </View>
  );
}

function EmployeeAttendanceTable({
  date,
  timeIn,
  timeOut,
}: {
  date: Date;
  timeIn: string;
  timeOut: string;
}) {
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
      <EmployeeRows date={date} timeIn={timeIn} timeOut={timeOut} />
    </View>
  );
}

function EmployeeRows({
  date,
  timeIn,
  timeOut,
}: {
  date: Date;
  timeIn: string;
  timeOut: string;
} & PropsWithChildren) {
  const days = getDaysInMonth(date);
  let data: any = [];

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
    let currentDate = set(date, { date: i + 1 });
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
        set(date, {
          hours: parseInt(timeIn.split(":")[0]),
          minutes: parseInt(timeIn.split(":")[1]),
        }),
        { minutes: Math.floor(Math.random() * (20 - 5)) + 5 }
      );
      let endTime = add(
        set(date, {
          hours: parseInt(timeOut.split(":")[0]),
          minutes: parseInt(timeOut.split(":")[1]),
        }),
        { minutes: Math.floor(Math.random() * (25 - 5)) + 5 }
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
