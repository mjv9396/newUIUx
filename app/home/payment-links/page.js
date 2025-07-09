import { adminRole, merchantRole } from "@/app/services/storageData";
import PaymentLinkList from "./components/PaymentLinkList";

const PaymentLinks = () => {
  return <PaymentLinkList role={adminRole()} isMerchant={merchantRole()} />;
};
export default PaymentLinks;
