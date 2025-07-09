import LoadMoneyList from "./components/LoadMoney";
import { adminRole, merchantRole, subMerchantRole } from "@/app/services/storageData";

const LoadMoney = () => (
  <LoadMoneyList
    isMerchant={merchantRole()}
    isAdmin={adminRole()}
    role={merchantRole()}
    isSubMerchant={subMerchantRole()}
  />
);
export default LoadMoney;
