import { parseValidDate } from "@/lib/utils";
import { Employee, OffDay } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { performRequest } from "./requestHandler";

const uploadEmployeesList = async (
  file: File
): Promise<Record<"employees", Employee[]>> => {
  return performRequest("/api/employees", "post", file);
};

const useUploadEmployees = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      let res = await uploadEmployeesList(file);

      return {
        employees: res.employees.map((employee: Employee, i: number) => {
          return {
            ...employee,
            doj: parseValidDate(employee.doj),
            dol: employee.dol ? parseValidDate(employee.dol) : undefined,
          };
        }),
      };
    },
  });
};

const uploadOffDaysList = async (
  file: File
): Promise<Record<"employeesOffDays", OffDay[]>> => {
  return performRequest("/api/employeeOffDays", "post", file);
};

const useUploadOffDaysList = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      let res = await uploadOffDaysList(file);

      return {
        employeesOffDays: res.employeesOffDays.map(
          (employee: OffDay, i: number) => {
            return {
              ...employee,
              date: parseValidDate(employee.date),
            };
          }
        ),
      };
    },
  });
};

export { useUploadEmployees, useUploadOffDaysList };
