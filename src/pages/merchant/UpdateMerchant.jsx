import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../../styles/merchant/Merchant.module.css";
import UserAccount from "./components/UserAccount";
import PayinAcquirerMapping from "./components/PayinAcquirerMapping";
import IPWhitelist from "./components/IPWhitelist";
import PersonalDetails from "./components/PersonalDetails";
import VerificationStatus from "./components/VerificationStatus";
import BankDetails from "./components/BankDetails";
import CompanyDetails from "./components/CompanyDetails";
import OperationDetails from "./components/OperationDetails";
import { useLocation } from "react-router-dom";
import TransactionRules from "./components/TransactionRules";
import PayoutAcquirerMapping from "./components/PayoutAcquirerMapping";
import PayinTransactionFlag from "./components/PayinTransactionFlag";
import PayinSettlement from "./components/PayinSettlement";
import Webhooks from "./components/Webhooks";
import KycDocuments from "./components/KycDocuments";
import moonGif from "../../assets/moon.gif";
const UpdateMerchant = () => {
  const [tab, setTab] = useState(1);
  const { state } = useLocation();
  return (
    <DashboardLayout page="Update Merchant">
      <div className={styles.listing}>
        <div className={styles.status}>
          <h5>USER ID: {state.userId}</h5>
          <h5>APP ID: {state.appId}</h5>
        </div>
        <div className="row">
          <div
            className="col-md-3 col-sm-12 px-3 "
            style={{
              borderRight: "3px dashed gray",
              maxHeight: "60vh",
              overflow: "auto",
            }}
          >
            <button
              onClick={() => setTab(1)}
              className={
                tab === 1
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>User Account Details</span>
              {tab === 1 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(2)}
              className={
                tab === 2
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Payin Acquirer Mapping</span>
              {tab === 2 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(11)}
              className={
                tab === 11
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Payin Transaction Flag</span>
              {tab === 11 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(12)}
              className={
                tab === 12
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Payin Settlement Cycle</span>
              {tab === 12 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(10)}
              className={
                tab === 10
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Payout Acquirer Mapping</span>
              {tab === 10 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(3)}
              className={
                tab === 3
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Payout IP Whitelist</span>
              {tab === 3 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(9)}
              className={
                tab === 9
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Transaction Rules</span>
              {tab === 9 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(13)}
              className={
                tab === 13
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Webhooks</span>
              {tab === 13 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(4)}
              className={
                tab === 4
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Personal Details</span>
              {tab === 4 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(5)}
              className={
                tab === 5
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Verification Status</span>
              {tab === 5 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(6)}
              className={
                tab === 6
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Bank Details</span>
              {tab === 6 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(7)}
              className={
                tab === 7
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Company Details</span>
              {tab === 7 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(8)}
              className={
                tab === 8
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>Operation Details</span>
              {tab === 8 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
            <button
              onClick={() => setTab(14)}
              className={
                tab === 14
                  ? styles.sidetab + " " + styles.active
                  : styles.sidetab
              }
            >
              <span>KYC Documents</span>
              {tab === 14 && (
                <img src={moonGif} alt="moon" className={styles.moonIcon} />
              )}
            </button>
          </div>
          <div
            style={{
              maxHeight: "60vh",
              overflow: "auto",
            }}
            className="col-md-9 col-sm-12 px-3"
          >
            {tab === 1 && <UserAccount {...state} />}
            {tab === 2 && <PayinAcquirerMapping {...state} />}
            {tab === 11 && <PayinTransactionFlag {...state} />}
            {tab === 3 && <IPWhitelist {...state} />}
            {tab === 4 && <PersonalDetails {...state} />}
            {tab === 5 && <VerificationStatus {...state} />}
            {tab === 6 && <BankDetails {...state} />}
            {tab === 7 && <CompanyDetails {...state} />}
            {tab === 8 && <OperationDetails {...state} />}
            {tab === 9 && <TransactionRules {...state} />}
            {tab === 10 && <PayoutAcquirerMapping {...state} />}
            {tab === 12 && <PayinSettlement {...state} />}
            {tab === 13 && <Webhooks {...state} />}
            {tab === 14 && <KycDocuments {...state} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpdateMerchant;
