import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import Balances from "./Balances";

const Tabs = () => {
  const [tab, setTab] = useState(1);

  return (
    <DashboardLayout
      page="Check Escrow Account Balance"
      url="/bank/fetch-account-balance"
    >
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-wallet2"></i>
          Balances
        </button>
        {/* <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
          disabled
        >
          <i className="bi bi-file-text"></i>
          Txn Statement
        </button>
        <button
          className={tab === 3 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(3)}
          disabled
        >
          <i className="bi bi-cloud"></i>
          Virtual Statement
        </button> */}
      </div>
      {tab === 1 && <Balances />}
      {tab === 2 && (
        <div className="text-center py-5">
          <h5 className="text-muted">Coming Soon</h5>
          <p className="text-muted">This feature is under development</p>
        </div>
      )}
      {tab === 3 && (
        <div className="text-center py-5">
          <h5 className="text-muted">Coming Soon</h5>
          <p className="text-muted">This feature is under development</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tabs;
