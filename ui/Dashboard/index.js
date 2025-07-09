import React from "react";
import PayInDashboard from "./components/PayInDashboard";
import PayOutDashboard from "./components/PayOutDashboard";
import Cookies from "js-cookie";

export default function Dashboard({ isAdmin, isMerchant,symbol, payinData }) {
  
  return (
    <div>
      <h3 className="mt-4">PayIn Dashboard</h3>
      <PayInDashboard
        symbol={symbol}
        data={payinData}
        isAdmin={isAdmin}
        isMerchant={isMerchant}
      />

      <h3 className="mt-4">PayOut Dashboard</h3>
      <PayOutDashboard />
    </div>
  );
}
