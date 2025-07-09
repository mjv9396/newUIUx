import SettlementList from "./components/SettlementList";
import { adminRole, merchantRole } from "@/app/services/storageData";

const Settlements = () => {
  const merchant = merchantRole();
  return <SettlementList role={adminRole()} isMerchant={merchant} />;
};
export default Settlements;
