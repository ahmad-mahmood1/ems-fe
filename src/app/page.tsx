"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import ReportsViewer from "@/components/ReportsViewer";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useIsClient from "@/hooks/useIsClient";
import { useUploadEmployees } from "@/network/api";
import { getMonth, subDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const configSchema = z.object({
  employeeListFile: z.object({
    file: z.instanceof(File).refine((val) => !!val, "File is required"),
    name: z.string(),
  }),
  name: z.string().min(1, { message: "Name is required" }).min(2, {
    message: "Name must be at least 2 characters.",
  }),
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

export default function ReportGenerationForm() {
  const mutation = useUploadEmployees();
  console.log("===  mutation:", mutation);
  const isClient = useIsClient();
  const defaultValues: Partial<ReportGenerationFormValues> = {
    name: "Al Hasan",
    timeIn: "09:00",
    timeOut: "17:00",
    reportType: "attendance",
    dateRange: {
      to: new Date(),
      from: subDays(new Date(), 20),
    },
    month: getMonth(new Date()).toString(),
  };

  const form = useForm<ReportGenerationFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues,
  });

  async function onSubmit(data: ReportGenerationFormValues) {
    let { employeeListFile, reportType, ...rest } = data;
    mutation.reset();
    await mutation.mutateAsync(employeeListFile.file as File);
    mutation.error &&
      toast({
        title: "Failed to load configuration",
        description: <div className="text-destructive">Invalid data!</div>,
      });
    form.reset(form.getValues(), { keepDirty: false });
  }

  return (
    <div>
      <div className="w-full px-2 py-4 border rounded-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-3 gap-x-2 gap-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time In</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Out</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeListFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee List File</FormLabel>
                  <FormControl>
                    <Input
                      value={undefined}
                      placeholder="Your name"
                      type="file"
                      onChange={(e) =>
                        e.currentTarget.files?.length &&
                        form.setValue(
                          field.name,
                          {
                            file: e.currentTarget.files[0],
                            name: e.currentTarget.files[0].name,
                          },
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          }
                        )
                      }
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                  </FormControl>
                  <FormDescription>Choose .xlsx / .xls file</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>
                  <FormControl>
                    <CalendarDateRangePicker
                      value={field.value}
                      onChange={(range) => {
                        form.setValue(
                          field.name,
                          {
                            from: range.from ? range.from : field.value.from,
                            to: range.to ? range.to : field.value.to,
                          },
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          }
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="month"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      name={field.name}
                      onOpenChange={(e) => {
                        !e && field.onBlur();
                      }}
                      onValueChange={(id) => {
                        form.setValue("month", id, {
                          shouldDirty: true,
                        });
                      }}
                      value={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">January</SelectItem>
                        <SelectItem value="1">February</SelectItem>
                        <SelectItem value="2">March</SelectItem>
                        <SelectItem value="3">April</SelectItem>
                        <SelectItem value="4">May</SelectItem>
                        <SelectItem value="5">June</SelectItem>
                        <SelectItem value="6">July</SelectItem>
                        <SelectItem value="7">August</SelectItem>
                        <SelectItem value="8">September</SelectItem>
                        <SelectItem value="9">October</SelectItem>
                        <SelectItem value="10">November</SelectItem>
                        <SelectItem value="11">December</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Report</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="attendance" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Attendance Report
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="salary" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Salary Cards
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex space-x-4 mt-4">
          <Button
            onClick={() => {
              form.handleSubmit(() => onSubmit(form.getValues()))();
            }}
            disabled={!form.formState.isDirty}
          >
            {form.formState.isSubmitting ? <Loader /> : "Load Configuration"}
          </Button>
        </div>
      </div>
      {isClient &&
        form.formState.isSubmitSuccessful &&
        !form.formState.isDirty &&
        mutation.isSuccess && (
          <ReportsViewer
            configData={form.getValues()}
            employees={mutation.data.employees}
          />
        )}
    </div>
  );
}
