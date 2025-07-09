import { adminRole, merchantRole } from "@/app/services/storageData";
import BeneficiariesList from "./components/BeneficiariesList";
export default function PayIn() {
  const role = adminRole();
  const merchant = merchantRole();
  
  return <BeneficiariesList isMerchant={merchant} isAdmin={role} role={merchant} />;
}
