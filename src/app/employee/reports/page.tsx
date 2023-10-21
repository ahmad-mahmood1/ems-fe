import { getCompanyDetails, getEmployees } from "@/network/api";
import { dehydrate } from "@tanstack/react-query";
import ReportsViewer from "./components/ReportsViewer";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/Hydrate";

async function Reports() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["employees"], getEmployees);
  await queryClient.prefetchQuery(["company"], getCompanyDetails);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ReportsViewer />
    </Hydrate>
  );
}

export default Reports;
