import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/common/Tab.module.css";
import AddReseller from "./components/AddReseller";
import ResellerList from "./components/ResellerList";

const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Reseller" url="/dashboard/reseller">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Reseller List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Reseller
        </button>
      </div>
      {tab === 1 && <ResellerList />}
      {tab === 2 && <AddReseller />}
    </DashboardLayout>
  );
};

export default Tabs;
