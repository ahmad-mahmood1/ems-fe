import { Separator } from "@/components/ui/separator";
import { CompanyProfileForm } from "./components/CompanyProfileForm";
import { dehydrate } from "@tanstack/react-query";
import { getCompanyDetails } from "@/network/api";
import getQueryClient from "../../utils/getQueryClient";
import Hydrate from "@/utils/Hydrate";

async function CompanySettingsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["company"], getCompanyDetails);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Setup company name and work durations
        </p>
      </div>
      <Separator />
      <Hydrate state={dehydratedState}>
        <CompanyProfileForm />
      </Hydrate>
    </div>
  );
}

export default CompanySettingsPage;
