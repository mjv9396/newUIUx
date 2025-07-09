// pages/index.js
"use client";
import { useState } from "react";
import dashboardData from "./components/dashboardData";

import styles from './styles/Dashboard.module.css';
import ExpenseCard from "./components/ExpenseCard";
import IncomeCard from "./components/IncomeCard";
import UpgradeCard from "./components/UpgradeCard";

export default function PayOutDashboard() {
  const [financialData, setFinancialData] = useState(dashboardData);

  return (
    <div className="container-fluid bg-light py-4">
      <div className={styles.dashboardContainer}>
        <div className="row g-4">
          <div className="col-md-6">
            <ExpenseCard
              total={financialData.expenses.total}
              weeklyData={financialData.expenses.weekly}
            />
          </div>
          <div className="col-md-6">
            <IncomeCard
              total={financialData.income.total}
              weeklyData={financialData.income.weekly}
            />
          </div>
          <div className="col-12">
            <UpgradeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
