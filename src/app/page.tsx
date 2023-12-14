"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import ReportsViewer from "@/components/ReportsViewer";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import useIsClient from "@/hooks/useIsClient";
import { useUploadEmployees, useUploadOffDaysList } from "@/network/api";
import {
  Employee,
  OffDay,
  ReportGenerationFormValues,
  configSchema,
} from "@/types";
import { getMonth, subDays } from "date-fns";
import { useState } from "react";

export default function ReportGenerationForm() {
  const [employeeFile, setEmployeeFile] = useState<FileList | null>(null);
  const [employeeList, setEmployeeList] = useState<Employee[] | null>(null);

  const [employeeOffDaysFile, setEmployeeOffDaysFile] =
    useState<FileList | null>(null);
  const [offDaysList, setOffDaysList] = useState<OffDay[] | null>(null);
  const mutation = useUploadEmployees();
  const offDayMutation = useUploadOffDaysList();
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
    form.reset(data, { keepDirty: false });
  }

  async function handleEmployeeFileUpload() {
    mutation.reset();
    let data = await mutation.mutateAsync((employeeFile as FileList)[0]);
    if (mutation.error) {
      toast({
        title: "Failed to load configuration",
        description: <div className="text-destructive">Invalid data!</div>,
      });
    } else {
      setEmployeeList(data.employees);
    }
  }

  async function handleOffDaysFileUpload() {
    offDayMutation.reset();
    let data = await offDayMutation.mutateAsync(
      (employeeOffDaysFile as FileList)[0]
    );
    if (offDayMutation.error) {
      toast({
        title: "Failed to load off days file",
        description: <div className="text-destructive">Invalid data!</div>,
      });
    } else {
      setOffDaysList(data.employeesOffDays);
    }
  }

  return (
    <div>
      <div className="w-full px-2 py-4 border rounded-md space-y-7">
        <div className="flex space-x-10 items-end">
          <div className="flex flex-col space-y-2">
            <Label>Employee List File</Label>
            <Input
              className="w-80"
              value={undefined}
              placeholder="Your name"
              type="file"
              onChange={(e) => {
                if (e.currentTarget.files?.length) {
                  mutation.reset();
                  setEmployeeFile(e.currentTarget.files);
                }
              }}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div>
          <Button
            onClick={handleEmployeeFileUpload}
            disabled={
              !employeeFile || mutation.isLoading || !!mutation.data?.employees
            }
          >
            {mutation.isLoading ? <Loader /> : "Upload Employees"}
          </Button>
        </div>

        <div className="flex space-x-10 items-end">
          <div className="flex flex-col space-y-2">
            <Label>Employee Off Days File</Label>
            <Input
              className="w-80"
              value={undefined}
              type="file"
              onChange={(e) => {
                if (e.currentTarget.files?.length) {
                  offDayMutation.reset();
                  setEmployeeOffDaysFile(e.currentTarget.files);
                }
              }}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
          </div>
          <Button
            onClick={handleOffDaysFileUpload}
            disabled={
              !employeeOffDaysFile ||
              offDayMutation.isLoading ||
              !!offDayMutation.data?.employeesOffDays
            }
          >
            {offDayMutation.isLoading ? <Loader /> : "Upload Employees"}
          </Button>
        </div>
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
                    <Input
                      placeholder="Your name"
                      {...field}
                    />
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
                    <Input
                      placeholder=""
                      {...field}
                      type="time"
                    />
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
                    <Input
                      placeholder=""
                      {...field}
                      type="time"
                    />
                  </FormControl>
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
              name="eobi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EOBI</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Eobi"
                      {...field}
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
            disabled={!employeeList}
          >
            {form.formState.isSubmitting ? <Loader /> : "Load Configuration"}
          </Button>
        </div>
      </div>
      {isClient &&
        form.formState.isSubmitSuccessful &&
        !form.formState.isDirty &&
        employeeList && (
          <ReportsViewer
            configData={form.getValues()}
            employees={employeeList}
            offDays={offDaysList || []}
          />
        )}
    </div>
  );
}
