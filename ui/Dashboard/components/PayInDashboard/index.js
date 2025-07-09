// pages/index.js
"use client";
import { useState } from "react";
import WelcomeCard from "./components/WelcomeCard";
import TransactionOverview from "./components/TransactionOverview";
import Settlements from "./components/Settlements";
import RefundsCard from "./components/RefundsCard";
import RemittanceCard from "./components/RemittanceCard";
import dashboardData from "./components/dashboardData";
import styles from "./styles/Dashboard.module.css";
import TransactionStats from "./components/TransactionStats";

export default function PayInDashboard({
  isAdmin,
  isMerchant,
  symbol,
  data = dashboardData,
  user,
}) {
  // const [data, setData] = useState(dashboardData);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className="container-fluid py-4">
          <div className="row mb-4">
            <div className="col-12 ">
              <WelcomeCard
                name={data.user.name}
                amount={data.user.amount}
                count={data.user.count}
                isAdmin={isAdmin}
                isMerchant={isMerchant}
                subAdminData={data.subAdmins}
                merchantData={data.merchants}
                resellerData={data.resellers}
                subMerchantData={data.subMerchants}
                symbol={symbol}
              />
            </div>
          </div>
          <div className="col-12 mb-4">
            <TransactionStats
              data={data.totalTransactions}
              symbol={symbol}
            />
          </div>
          <div className="col-12 mb-4">
            <TransactionOverview
              data={data.transactions}
            />
          </div>

          <div className="row">
            <div className="col-12 col-lg-5  mb-4 mb-lg-0">
              <Settlements symbol={symbol} data={data.settlements} />
            </div>
            <div className="col-12 col-lg-3 flex-grow-1 mb-4 mb-lg-0">
              <RefundsCard data={data.refunds} />
            </div>
            <div className="col-12 col-lg-3 flex-grow-1">
              <RemittanceCard data={data.remittance} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
