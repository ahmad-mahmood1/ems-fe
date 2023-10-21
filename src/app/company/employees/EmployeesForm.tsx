"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUploadEmployees } from "@/network/api";
import useIsClient from "@/hooks/useIsClient";
import { useQueryClient } from "@tanstack/react-query";

export function EmployeesForm() {
  const isClient = useIsClient();

  const employeesSchema = z.object({
    employeeListFile: !isClient ? z.instanceof(Object) : z.instanceof(FileList),
  });

  type EmployeesFormValues = z.infer<typeof employeesSchema>;

  const defaultValues: Partial<EmployeesFormValues> = {
    // employeeListFile: undefined,
  };

  const form = useForm<EmployeesFormValues>({
    resolver: zodResolver(employeesSchema),
    defaultValues,
  });

  const queryClient = useQueryClient();
  const mutation = useUploadEmployees(queryClient);

  async function onSubmit(data: EmployeesFormValues) {
    mutation.mutate(data.employeeListFile as FileList);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="employeeListFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={undefined}
                  placeholder="Your name"
                  type="file"
                  onChange={(e) =>
                    e.currentTarget.files &&
                    form.setValue("employeeListFile", e.currentTarget.files)
                  }
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Employee List</Button>
      </form>
    </Form>
  );
}
