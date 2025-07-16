import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import LoadMoneyList from "./LoadMoneyList";
import AddLoadMoney from "./AddLoadMoney";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Load Money" url="/dashboard/load-money">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Load Money List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Load Money
        </button>
      </div>
      {tab === 1 && <LoadMoneyList />}
      {tab === 2 && <AddLoadMoney />}
    </DashboardLayout>
  );
};

export default Tabs;
