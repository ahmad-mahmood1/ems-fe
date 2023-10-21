"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
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
import { useGetCopmanyDetails, useUploadCompanyDetails } from "@/network/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const companyProfileSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2, {
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
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

export function CompanyProfileForm() {
  const { data, isLoading, isFetching, isError, isFetched } =
    useGetCopmanyDetails();
  console.log("===  data:", data, isFetching);

  const defaultValues: DefaultValues<CompanyProfileFormValues> = {};
  const form = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: defaultValues,
  });

  const queryClient = useQueryClient();
  const mutation = useUploadCompanyDetails(queryClient);

  async function onSubmit(data: CompanyProfileFormValues) {
    mutation.mutate(data);
    toast({
      title: "Form submitted successfully",
      // description: (
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      //   </pre>
      // ),
    });
  }

  useEffect(() => {
    !isFetching && form.reset(data.company);
  }, [isFetching]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
        <Button type="submit">Update Company</Button>
      </form>
    </Form>
  );
}
