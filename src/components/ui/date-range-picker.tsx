"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CalendarDateRangePickerProps = {
  className?: string;
  value?: DateRange;
  defaultValue?: DateRange;

  onChange?: (range: DateRange) => void;
};

export function CalendarDateRangePicker({
  className,
  value,
  onChange,
  defaultValue,
}: CalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    defaultValue || {
      from: new Date(2023, 0, 20),
      to: addDays(new Date(2023, 0, 20), 20),
    }
  );

  let range = value ? value : date;

  const handleDateRangeSelect = (dateRange: DateRange) => {
    onChange ? onChange(dateRange) : setDate(dateRange);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={(range) => {
              range && handleDateRangeSelect(range);
            }}
            numberOfMonths={2}
            disabled={{ after: addDays(new Date(), 1) }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
