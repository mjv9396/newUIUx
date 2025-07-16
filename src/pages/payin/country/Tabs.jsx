import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import CountryList from "./CountryList";
import AddCountry from "./AddCountry";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Country" url="/dashboard/country">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Country List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Country
        </button>
      </div>
      {tab === 1 && <CountryList />}
      {tab === 2 && <AddCountry />}
    </DashboardLayout>
  );
};

export default Tabs;
