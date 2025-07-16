import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import AcquirerList from "./AcquirerList";
import AddAcquirer from "./AddAcquirer";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Acquirer" url="/dashboard/acquirer">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          All
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add
        </button>
      </div>
      {tab === 1 && <AcquirerList />}
      {tab === 2 && <AddAcquirer />}
    </DashboardLayout>
  );
};

export default Tabs;
