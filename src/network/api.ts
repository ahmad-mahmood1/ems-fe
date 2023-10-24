import { parseValidDate } from "@/lib/utils";
import { Employee } from "@/types";
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

export { useUploadEmployees };
