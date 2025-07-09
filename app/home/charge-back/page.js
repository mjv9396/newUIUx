import { adminRole, merchantRole } from "@/app/services/storageData";
import ChargeBackList from "./components/ChargeBackList";

const ChargeBack = () => {
  const merchant = merchantRole();

  return <ChargeBackList role={adminRole()} isMerchant={merchant} />;
};

export default ChargeBack;
