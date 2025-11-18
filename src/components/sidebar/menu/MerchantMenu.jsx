/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../styles/components/ModernSidebar.module.css";
import home from "../../../assets/dashboard.png";
import payin from "../../../assets/pay.png";
import doc from "../../../assets/doc.png";
import payout from "../../../assets/payout.png";
import fraud from "../../../assets/fraud.png";
import login from "../../../assets/login.png";
import kyc from "../../../assets/kyc.png";
import web from "../../../assets/world-wide-web.png";
import avatar from "../../../assets/avatar.png";
import ledger from "../../../assets/bank-statement.png";
import downlaodfile from "../../../assets/download-file.png";
import remittance from "../../../assets/remittance.png";
import chargeback from "../../../assets/reconciliation.png";
import logo from "../../../assets/logo.png";
import { GetUsername, clearCookieStorage } from "../../../services/cookieStore";
import { successMessage } from "../../../utils/messges";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";

const MerchantMenu = ({ toggle, setToggle, status }) => {
  const navigate = useNavigate();
  const { fetchData: LogoutUser } = useFetch();

  const handleLogout = () => {
    LogoutUser(endpoints.logout);
    clearCookieStorage();
    successMessage("Logout Successfully");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "M";
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
              {GetUsername()?.split("@")[0] || "Merchant"}
            </p>
            <p className={styles.userRole}>Merchant</p>
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
          <li className={styles.menuItem}>
            <Link to="/kyc-verification">
              <span>
                <img src={kyc} alt="kyc" width={20} height={20} />
                <span>KYC Verification</span>
              </span>
            </Link>
          </li>
          {status && (
            <>
              <li className={styles.menuItem}>
                <Link to="/dashboard">
                  <span>
                    <img src={home} alt="dashboard" width={20} height={20} />
                    <span>Dashboard</span>
                  </span>
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/merchant-profile">
                  <span>
                    <img src={avatar} alt="profile" width={20} height={20} />
                    <span> Profile</span>
                  </span>
                </Link>
              </li>
              <li className={styles.menuHeader}>MENU</li>
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
              <li className={styles.menuItem}>
                <Link to="/virtual-account">
                  <span>
                    <img src={chargeback} alt="user" width={20} height={20} />
                    <span>Virtual Collections</span>
                  </span>
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/user-virtual-accounts">
                  <span>
                    <img src={chargeback} alt="user" width={20} height={20} />
                    <span>User Virtual Accounts</span>
                  </span>
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/virtual-dispute">
                  <span>
                    <img src={chargeback} alt="user" width={20} height={20} />
                    <span>Virtual Dispute</span>
                  </span>
                </Link>
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
                <Link to="/merchant-whitelist">
                  <span>
                    <img src={fraud} alt="whitelist" width={20} height={20} />
                    <span>Whitelist</span>
                  </span>
                </Link>
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
                    <Link to="/payout/add-beneficiaries">
                      <span>Beneficiary Save Bank</span>
                    </Link>
                  </li>
                  <li className={styles.subMenuItem}>
                    <Link to="/payout/add-vpa">
                      <span>Beneficiary Save VPA</span>
                    </Link>
                  </li>
                  <li className={styles.subMenuItem}>
                    <Link to="/payout/send-money">
                      <span>Transfer Money</span>
                    </Link>
                  </li>
                  <li className={styles.subMenuItem}>
                    <Link to="/payout/single-payout">
                      <span>Transfer to Beneficiary</span>
                    </Link>
                  </li>
                  <li className={styles.subMenuItem}>
                    <Link to="/payout/bulk-payout">
                      <span>Bulk Payout</span>
                    </Link>
                  </li>
                  <li className={styles.subMenuItem}>
                    <Link to="/payout/transactions">
                      <span>Transactions</span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className={styles.menuItem}>
                <Link
                  to="#reports"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="#reports"
                >
                  <span>
                    <img
                      src={downlaodfile}
                      alt="reports"
                      width={20}
                      height={20}
                    />
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
                <Link to="/documentation">
                  <span>
                    <img src={doc} alt="documentation" width={20} height={20} />
                    <span>Developer</span>
                  </span>
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/webhooks">
                  <span>
                    <img src={web} alt="documentation" width={20} height={20} />
                    <span>Web Hooks</span>
                  </span>
                </Link>
              </li>
            </>
          )}
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
        </ul>
      </nav>
    </div>
  );
};

export default MerchantMenu;
