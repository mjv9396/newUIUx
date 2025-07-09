import Sidebar from "@/ui/Sidebar";
import Logo from "../logo/Logo";
import classes from "./Sidebar.module.css";
import Menu from "./components/Menu";
import {
  adminRole,
  merchantRole,
  resellerRole,
} from "@/app/services/storageData";

export default function Side() {
  const isAdmin = adminRole();
  const isMerchant = merchantRole();
  const isReseller = resellerRole();

  return (
    <Sidebar
      isAdmin={isAdmin}
      isMerchant={isMerchant}
      isReseller={isReseller}
    />
  );
}
