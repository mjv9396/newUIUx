import {
  adminRole,
  merchantRole,
  subMerchantRole,
} from "../services/storageData";
import Wrapper from "./components/wrapper/Wrapper";
import KycBanner from "./dashboard/components/kycBanner/KycBanner";
import BaseDashboard from "./dashboard/BaseDashboard";
export default function Home() {
  return (
    <Wrapper pagename="Dashboard">
      {merchantRole() && <KycBanner />}
      <BaseDashboard
        isMerchant={merchantRole()}
        isAdmin={adminRole()}
        role={merchantRole()}
        isSubMerchant={subMerchantRole()}
      />

      {/* <Filter isSubMerchant={subMerchantRole()} role={merchantRole()} /> */}
    </Wrapper>
  );
}
