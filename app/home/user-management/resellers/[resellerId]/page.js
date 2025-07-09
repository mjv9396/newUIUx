import { adminRole, merchantRole } from "@/app/services/storageData";
import Details from "./components/Details";

const ResellerDetail = () => {
  return <Details merchantRole={merchantRole()} AdminRole={adminRole()} />;
};

export default ResellerDetail;
