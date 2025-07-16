import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import MopTypeList from "./MopTypeList";
import AddMopType from "./AddMopType";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="MOP Type" url="/dashboard/mop-type">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          MOP Type List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add MOP Type
        </button>
      </div>
      {tab === 1 && <MopTypeList />}
      {tab === 2 && <AddMopType />}
    </DashboardLayout>
  );
};

export default Tabs;
