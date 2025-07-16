import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import ChargingDetailList from "./ChargingDetailList";
import AddChargingDetail from "./AddChargingDetail";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout
      page="Payin Charging Details"
      url="/dashboard/payin-charging-detail"
    >
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Charging Details
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Charging Details
        </button>
      </div>
      {tab === 1 && <ChargingDetailList />}
      {tab === 2 && <AddChargingDetail />}
    </DashboardLayout>
  );
};

export default Tabs;
