import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import VPAExist from "./VPAExist";
import VPAAbsent from "./VPAAbsent";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Transfer Money" url="/dashboard/single-pay">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Save Beneficiary
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          VPA Not Saved
        </button>
      </div>
      {tab === 1 && <VPAExist />}
      {tab === 2 && <VPAAbsent />}
    </DashboardLayout>
  );
};

export default Tabs;
