import SettlementList from "./components/SettlementList";
import { adminRole } from "@/app/services/storageData";

const Settlements = () => {
  return <SettlementList role={adminRole()} />;
};
export default Settlements;
