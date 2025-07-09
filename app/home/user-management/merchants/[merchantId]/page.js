import { merchantRole } from "@/app/services/storageData";
import Details from "./components/Details";

const MerchantDetail = () => {
  return <Details merchant={merchantRole()} />;
};

export default MerchantDetail;
