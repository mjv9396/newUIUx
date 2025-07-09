import { adminRole, merchantRole } from "@/app/services/storageData";
import AllOrderList from "./components/OrderList";
const OrderList = () => {
  const role = adminRole();
  const merchant = merchantRole();
  return <AllOrderList role={role} isMerchant={merchant} />;
};

export default OrderList;
