import { useState, memo } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import NotificationIcon from "../components/notification/NotificationIcon";
import { isAdmin, isMerchant } from "../services/cookieStore";

/* eslint-disable react/prop-types */
const DashboardLayout = memo(({ children, page, url }) => {
  const [toggle, setToggle] = useState(true); // Start with sidebar open
  return (
    <div className="main">
      <Sidebar toggle={toggle} setToggle={setToggle} />

      <div className={toggle ? "section" : "section active"}>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="pagetitle m-0">{page}</h4>
            <small style={{ marginBottom: "0px !important" }}>{url}</small>
          </div>
          {isMerchant() && <NotificationIcon />}
        </div>
        {children}
      </div>
    </div>
  );
});

export default DashboardLayout;
