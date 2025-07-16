import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import CurrencyList from "./CurrencyList";
import AddCurrency from "./AddCurrency";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Currency" url="/dashboard/currency">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Currency List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Curreny
        </button>
      </div>
      {tab === 1 && <CurrencyList />}
      {tab === 2 && <AddCurrency />}
    </DashboardLayout>
  );
};

export default Tabs;
