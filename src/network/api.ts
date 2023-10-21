import { convertJSONObjectToString } from "@/lib/utils";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { performRequest } from "./requestHandler";

const getEmployees = () => {
  return performRequest("/api/employees");
};

const uploadEmployeesList = (file: File) => {
  return performRequest("/api/employees", "post", file);
};

const getCompanyDetails = () => {
  return performRequest("/api/company");
};

const uploadCompanyDetails = (data: any) => {
  return performRequest(
    "/api/company",
    "post",
    convertJSONObjectToString(data)
  );
};

const useGetEmployees = () =>
  useQuery({
    queryFn: () => getEmployees(),
    queryKey: ["employees"],
    cacheTime: Infinity,
  });

const useUploadEmployees = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (fileList: FileList) => uploadEmployeesList(fileList[0]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

const useGetCopmanyDetails = () =>
  useQuery({
    queryFn: () => getCompanyDetails(),
    queryKey: ["company"],
    cacheTime: Infinity,
  });

const useUploadCompanyDetails = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (data: any) => uploadCompanyDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
};

export {
  getCompanyDetails,
  getEmployees,
  useGetCopmanyDetails,
  useGetEmployees,
  useUploadCompanyDetails,
  useUploadEmployees,
};
