/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { memo } from "react";
import styles from "../../../styles/components/ModernSidebar.module.css";
import home from "../../../assets/dashboard.png";
import payin from "../../../assets/pay.png";
import payout from "../../../assets/payout.png";
import fraud from "../../../assets/fraud.png";
import login from "../../../assets/login.png";
import bank from "../../../assets/banking-service.png";
import merchant from "../../../assets/seller.png";
import tdr from "../../../assets/bill.png";
import Copyright from "../../copyright/Copyright";
import ledger from "../../../assets/bank-statement.png";
import downlaodfile from "../../../assets/download-file.png";
import remittance from "../../../assets/remittance.png";
import reseller from "../../../assets/reseller.png";
import update from "../../../assets/transaction.png";
import { GetUsername, clearCookieStorage } from "../../../services/cookieStore";
import chargeback from "../../../assets/reconciliation.png";
import logo from "../../../assets/logo.png";
import { successMessage } from "../../../utils/messges";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";

const AdminMenu = memo(({ toggle, setToggle }) => {
  const navigate = useNavigate();
  const { fetchData: LogoutUser } = useFetch();

  const handleLogout = () => {
    LogoutUser(endpoints.logout);
    clearCookieStorage();
    successMessage("Logout Successfully");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split("@")[0].charAt(0).toUpperCase();
  };

  return (
    <div
      className={toggle ? styles.sidebar : styles.sidebar + " " + styles.active}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <img src={logo} alt="BirdPay" />
          </div>

          <button
            className={styles.toggleButton}
            onClick={() => setToggle(!toggle)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{getInitials(GetUsername())}</div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>
              {GetUsername()?.split("@")[0] || "Admin"}
            </p>
            <p className={styles.userRole}>Administrator</p>
          </div>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>

      <nav>
        <ul className={styles.menu}>
          <li className={styles.menuItem} data-tooltip="Dashboard">
            <Link to="/dashboard">
              <span>
                <img src={home} alt="dashboard" width={20} height={20} />
                <span>Dashboard</span>
              </span>
            </Link>
          </li>

          <li className={styles.menuHeader}>MENU</li>

          <li className={styles.menuItem} data-tooltip="Merchant Setup">
            <Link
              to="#user"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#user"
            >
              <span>
                <img src={merchant} alt="user" width={20} height={20} />
                <span>Merchant Setup</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>

            <ul className={`${styles.subMenu} collapse`} id="user">
              <li>
                <Link to="/merchant-list">
                  <span>Merchants</span>
                </Link>
              </li>
              <li>
                <Link to="/merchant-whitelist">
                  <span>Whitelist</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className={styles.menuItem} data-tooltip="Reseller Setup">
            <Link
              to="#reseller"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#reseller"
            >
              <span>
                <img src={reseller} alt="reseller" width={20} height={20} />
                <span>Reseller Setup</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>

            <ul className={`${styles.subMenu} collapse`} id="reseller">
              <li>
                <Link to="/reseller">
                  <span>Resellers</span>
                </Link>
              </li>
              <li>
                <Link to="/reseller-mapping">
                  <span>Reseller Mapping</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className={styles.menuItem} data-tooltip="Bank Settings">
            <Link
              to="#bank"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#bank"
            >
              <span>
                <img src={bank} alt="bank" width={20} height={20} />
                <span>Bank Setting</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>

            <ul className={`${styles.subMenu} collapse`} id="bank">
              <li>
                <Link to="/acquirer">
                  <span>Acquirer</span>
                </Link>
              </li>
              <li>
                <Link to="/payin/acquirer-profile">
                  <span>Payin Acquirer Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/payout/acquirer-profile">
                  <span>Payout Acquirer Profile</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className={styles.menuItem}>
            <Link
              to="#tdr"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#tdr"
            >
              <span>
                <img src={tdr} alt="user" width={20} height={20} />
                <span>TDR Setting</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>
            <ul className={`${styles.subMenu} collapse`} id="tdr">
              <li>
                <Link to="/payin/charging-detail">
                  <span>Payin Charging Details</span>
                </Link>
              </li>
              <li>
                <Link to="/payout/charging-detail">
                  <span>Payout Charging Details</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="#payin"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#payin"
            >
              <span>
                <img src={payin} alt="payin" width={20} height={20} />
                <span>Payin</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>
            <ul className={`${styles.subMenu} collapse`} id="payin">
              <li className={styles.subMenuItem}>
                <Link to="/payin/currency">
                  <span>Currency</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payin/country">
                  <span>Country</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payin/payment-type">
                  <span>Payment Type</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payin/mop-type">
                  <span>MOP Type</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payin/transactions">
                  <span>Transactions</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payin/settlement">
                  <span>Settlement Reports</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className={styles.menuItem}>
            <Link to="/dispute">
              <span>
                <img src={chargeback} alt="user" width={20} height={20} />
                <span>Dispute</span>
              </span>
            </Link>
          </li>
          {/* <li className={styles.menuItem}>
            <Link to="/virtual-account">
              <span>
                <img src={chargeback} alt="user" width={20} height={20} />
                <span>Virtual Collections</span>
              </span>
            </Link>
          </li> */}

          <li className={styles.menuItem}>
            <Link
              to="#virtual"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#virtual"
            >
              <span>
                <img src={bank} alt="virtual" width={20} height={20} />
                <span>Escrow Accounts</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>

            <ul className={`${styles.subMenu} collapse`} id="virtual">
              <li>
                <Link to="/virtual-account">
                  <span>Virtual Collections</span>
                </Link>
              </li>
              <li>
                <Link to="/main-account-statements">
                  <span>Main Account Statements</span>
                </Link>
              </li>
              <li>
                <Link to="/user-virtual-accounts">
                  <span>User Virtual Accounts</span>
                </Link>
              </li>
              <li>
                <Link to="/virtual-dispute">
                  <span>Virtual Dispute</span>
                </Link>
              </li>
              <li>
                <Link to="/check-account-balance">
                  <span>Account Balance</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className={styles.menuItem}>
            <Link
              to="#fraud"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#fraud"
            >
              <span>
                <img src={fraud} alt="fraud" width={20} height={20} />
                <span>Fraud Preventions</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>
            <ul className={`${styles.subMenu} collapse`} id="fraud">
              <li className={styles.subMenuItem}>
                <Link to="/fraud-prevention">
                  <span>Fraud Prevention</span>
                </Link>
              </li>
            </ul>
          </li>
          <li className={styles.menuItem}>
            <Link
              to="#payout"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#payout"
            >
              <span>
                <img src={payout} alt="payout" width={20} height={20} />
                <span>Payout</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>
            <ul className={`${styles.subMenu} collapse`} id="payout">
              <li className={styles.subMenuItem}>
                <Link to="/payout/load-money">
                  <span>Load Money</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payout/beneficiaries">
                  <span>Beneficiary</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/payout/transactions">
                  <span>Transactions</span>
                </Link>
              </li>
            </ul>
          </li>
          {GetUsername() === "admin@gmail.com" && (
            <li className={styles.menuItem}>
              <Link
                to="#update-transaction"
                data-bs-toggle="collapse"
                role="button"
                aria-expanded="false"
                aria-controls="#update-transaction"
              >
                <span>
                  <img
                    src={update}
                    alt="update-transaction"
                    width={20}
                    height={20}
                  />
                  <span>Update Transactions</span>
                </span>
                <i className="bi bi-chevron-down"></i>
              </Link>
              <ul
                className={`${styles.subMenu} collapse`}
                id="update-transaction"
              >
                <li className={styles.subMenuItem}>
                  <Link to="/update-transaction/payin">
                    <span>Payin Transaction</span>
                  </Link>
                </li>
                <li className={styles.subMenuItem}>
                  <Link to="/update-transaction/payout">
                    <span>Payout Transaction</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}

          <li className={styles.menuItem}>
            <Link
              to="#reports"
              data-bs-toggle="collapse"
              role="button"
              aria-expanded="false"
              aria-controls="#reports"
            >
              <span>
                <img src={downlaodfile} alt="reports" width={20} height={20} />
                <span>Reports</span>
              </span>
              <i className="bi bi-chevron-down"></i>
            </Link>
            <ul className={`${styles.subMenu} collapse`} id="reports">
              <li className={styles.subMenuItem}>
                <Link to="/analytics">
                  <span>Analytics</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/view-reports">
                  <span>Download Reports</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/remittance-report">
                  <span>Remittance</span>
                </Link>
              </li>
              <li className={styles.subMenuItem}>
                <Link to="/account-statement">
                  <span>Payout Ledger Report</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className={styles.menuHeader}>EXTRA</li>
          <li className={styles.menuItem}>
            <Link to="/login-history">
              <span>
                <img src={login} alt="login" width={20} height={20} />
                <span>Login History</span>
              </span>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <Link to="/update-password">
              <span>
                <i className="bi bi-key"></i>
                <span>Reset Password</span>
              </span>
            </Link>
          </li>
          <li className={styles.menuItem}>
            <button
              onClick={handleLogout}
              className={styles.logoutMenuItem}
              title="Logout"
            >
              <span>
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <div className={styles.copyrightSection}>
        <Copyright />
      </div>
    </div>
  );
});

export default AdminMenu;
