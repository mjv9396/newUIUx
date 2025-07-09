import { adminRole } from "@/app/services/storageData";
import Details from "./components/Details";

const Reseller = () => {
  return <Details role={adminRole()} />;
};

export default Reseller;
