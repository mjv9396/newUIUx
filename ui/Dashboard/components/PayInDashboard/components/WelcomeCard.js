import styles from "../styles/WelcomeCard.module.css";
import StatCard from "./StatCard";
import TransactionStats from "./TransactionStats";
import UserCounts from "./UserCount";

export default function WelcomeCard({
  name,
  amount,
  count,
  adminData,
  subAdminData,
  merchantData,
  resellerData,
  subMerchantData,
  isAdmin = false,
  isMerchant = false,
  symbol,
}) {
  return (
    <div style={{ flexWrap: "wrap" }} className={styles.welcomeCardContainer}>
      <div
        style={{ minWidth: "300px", height: "100%" }}
        className={styles.welcomeCard}
      >
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <div className={styles.icon}>
              <i width="24" height="24" className="bi bi-graph-up-arrow"></i>
            </div>
            <div className={styles.welcomeText}>
              <h4>
                Welcome Back
                <br />
                <span className={styles.name}>{name}</span>
              </h4>
            </div>
          </div>

          <div className={styles.metricsContainer}>
            <div className={styles.metricItem}>
              <div className={styles.metricLabel}>Today's Txn Amount</div>
              <div className={styles.metricValue}>
                {symbol}
                {amount.toLocaleString()}
              </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.metricItem}>
              <div className={styles.metricLabel}>Today's Txn Count</div>
              <div className={styles.metricValue}>{count.toLocaleString()}</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.metricItem}>
              <div className={styles.metricLabel}>Account Balance</div>
              <div className={styles.metricValue}>
                {symbol} {count.toLocaleString()}
              </div>
            </div>
          </div>

          {/* <div className={styles.targetContainer}>
          <img height={200} width={200} src="/images/target.png" alt="Target" className={styles.targetIcon} />
        </div> */}
        </div>
      </div>

      <UserCounts
        title="Total Users"
        userData={[
          { type: "Sub Admins", count: subAdminData.value },
          { type: "Merchants", count: merchantData.value },
          { type: "Resellers", count: resellerData.value },
          { type: "Sub Merchants", count: subMerchantData.value },
        ]}
        color="teal"
      />
    </div>
  );
}
