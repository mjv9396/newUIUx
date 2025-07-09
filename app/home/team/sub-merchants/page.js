import { adminRole, merchantRole } from "@/app/services/storageData";
import SubMerchantList from "./components/SubMerchantList";

const SubMerchants = () => {
  return <SubMerchantList role={merchantRole() || adminRole()} />;
};

export default SubMerchants;
