import React from "react";
import { formatToINRCurrency } from "../../../utils/formatToINRCurrency ";
import styles from "./DetailCard.module.css";

const DetailCard = ({ img, title, amount, subtitle, type = "success" }) => {
  const getCardClass = () => {
    switch (type) {
      case "success":
        return styles.successCard;
      case "info":
        return styles.infoCard;
      case "failed":
        return styles.failedCard;
      case "pending":
        return styles.pendingCard;
      default:
        return styles.successCard;
    }
  };

  return (
    <div className={`${styles.walletCard} ${getCardClass()}`}>
      <div className={styles.cardBackground}>
        <div className={styles.cardGlow}></div>
        <div className={styles.cardContent}>
          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <div className={styles.iconBg}>
                <img src={img} alt={title} className={styles.icon} />
              </div>
              <div className={styles.iconPulse}></div>
            </div>
            <div className={styles.textSection}>
              <h3 className={styles.title}>{title}</h3>
              <span className={styles.subtitle}>{subtitle}</span>
            </div>
          </div>

          <div className={styles.amountSection}>
            <div className={styles.amountWrapper}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>
                {amount ? formatToINRCurrency(amount).replace("₹", "") : "0.00"}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>

          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
