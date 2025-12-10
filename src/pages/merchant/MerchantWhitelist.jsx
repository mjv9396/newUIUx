import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/common/Add.module.css";
import IPWhitelistTab from "./whitelist/IPWhitelistTab";
import AccountWhitelistTab from "./whitelist/AccountWhitelistTab";
import VirtualAddressWhitelistTab from "./whitelist/VirtualAddressWhitelistTab";

const MerchantWhitelist = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <DashboardLayout page="Merchant Whitelist">
      <div className={styles.listing}>
        {/* Tab Navigation */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                  onClick={() => setActiveTab(1)}
                  type="button"
                >
                  Account Whitelist
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 2 ? "active" : ""}`}
                  onClick={() => setActiveTab(2)}
                  type="button"
                >
                  IP Whitelist
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 3 ? "active" : ""}`}
                  onClick={() => setActiveTab(3)}
                  type="button"
                >
                  Virtual Address Whitelist
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 1 && <AccountWhitelistTab />}
          {activeTab === 2 && <IPWhitelistTab />}
          {activeTab === 3 && <VirtualAddressWhitelistTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MerchantWhitelist;
