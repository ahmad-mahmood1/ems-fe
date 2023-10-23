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
    mutationFn: async (fileList: FileList) => {
      let res = await uploadEmployeesList(fileList[0]);
      return {
        employees: res.employees.map((employee) => {
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
