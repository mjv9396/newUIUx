import { useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/Tab.module.css";
import PaymentTypeList from "./PaymentTypeList";
import AddPaymentType from "./AddPaymentType";
const Tabs = () => {
  const [tab, setTab] = useState(1);
  return (
    <DashboardLayout page="Payment Type" url="/dashboard/payment-type">
      <div className={styles.tabs}>
        <button
          className={tab === 1 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(1)}
        >
          <i className="bi bi-list-ol"></i>
          Payment Type List
        </button>
        <button
          className={tab === 2 ? styles.tab + " " + styles.active : styles.tab}
          onClick={() => setTab(2)}
        >
          <i className="bi bi-plus-circle"></i>
          Add Payment Type
        </button>
      </div>
      {tab === 1 && <PaymentTypeList />}
      {tab === 2 && <AddPaymentType />}
    </DashboardLayout>
  );
};

export default Tabs;
