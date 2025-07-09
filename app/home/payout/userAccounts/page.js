import {
  adminRole,
  merchantRole,
  subMerchantRole,
} from "@/app/services/storageData";
import UserAccountsList from "./components/UserAccounts";

const UserAccounts = () => (
  <UserAccountsList
    isMerchant={merchantRole()}
    isAdmin={adminRole()}
    role={merchantRole()}
    isSubMerchant={subMerchantRole()}
  />
);
export default UserAccounts;
