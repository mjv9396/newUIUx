import { useState, memo } from "react";
import Sidebar from "../components/sidebar/Sidebar";

/* eslint-disable react/prop-types */
const DashboardLayout = memo(({ children, page, url }) => {
  const [toggle, setToggle] = useState(true); // Start with sidebar open
  return (
    <div className="main">
      <Sidebar toggle={toggle} setToggle={setToggle} />

      {/* Floating toggle button - visible when sidebar is closed */}
      {!toggle && (
        <button
          className="floating-toggle-btn"
          onClick={() => setToggle(true)}
          title="Open Sidebar"
        >
          <i className="bi bi-list"></i>
        </button>
      )}

      <div className={toggle ? "section" : "section active"}>
        <h4 className="pagetitle m-0">{page}</h4>
        <small style={{ marginBottom: "0px !important" }}>{url}</small>
        {children}
      </div>
    </div>
  );
});

export default DashboardLayout;
