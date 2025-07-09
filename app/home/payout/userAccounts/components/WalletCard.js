import React from "react";
import styles from "./WalletCard.module.css";

const WalletCard = ({ wallet }) => {
  return (
    <div
      style={{
        backgroundColor:
          wallet.balance > 0
            ? "#4CAF50"
            : wallet.balance === 0
            ? "#FF9800"
            : "#F44336",
      }}
      className={styles.visaCard}
    >
      <div className={styles.waveBg}></div>
      <div className={styles.cardContent}>
        <div>
          <div className={styles.balanceLabel}>Balance</div>
          <div className={styles.balanceAmount}>{wallet.balance || "0.00"}</div>
          <div className={styles.visaLogo}>{wallet.currency || "INR"}</div>
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.cardNumber}>Last Modify Date </div>
          <div className={styles.expiryDate}>01/02/2024</div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
