/* eslint-disable react/prop-types */
import { memo } from "react";
import AdminMenu from "./menu/AdminMenu";
import ResellerMenu from "./menu/ResellerMenu";
import MerchantMenu from "./menu/MerchantMenu";
import {
  GetUserStatus,
  isAdmin,
  isMerchant,
  isReseller,
} from "../../services/cookieStore";

const Sidebar = memo(({ toggle, setToggle }) => {
  // Direct rendering without delays to prevent glitches
  if (isAdmin()) {
    return <AdminMenu key="admin-menu" toggle={toggle} setToggle={setToggle} />;
  }

  if (isReseller()) {
    return (
      <ResellerMenu key="reseller-menu" toggle={toggle} setToggle={setToggle} />
    );
  }

  if (isMerchant()) {
    return (
      <MerchantMenu
        key="merchant-menu"
        toggle={toggle}
        setToggle={setToggle}
        status={GetUserStatus()}
      />
    );
  }

  return null;
});

export default Sidebar;
