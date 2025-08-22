import React from "react";
import { formatToINRCurrency } from "../../../utils/formatToINRCurrency ";
import styles from "./SettlementCard.module.css";

const SettlementCard = ({
  img,
  primaryTitle,
  primaryAmount,
  secondaryTitle,
  secondaryAmount,
  type = "settled",
}) => {
  const getCardClass = () => {
    switch (type) {
      case "settled":
        return styles.settledCard;
      case "unsettled":
        return styles.unsettledCard;
      default:
        return styles.settledCard;
    }
  };

  return (
    <div className={`${styles.settlementCard} ${getCardClass()}`}>
      <div className={styles.cardBackground}>
        <div className={styles.cardGlow}></div>
        <div className={styles.cardContent}>
          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <div className={styles.iconBg}>
                <img src={img} alt="settlement" className={styles.icon} />
              </div>
              <div className={styles.iconPulse}></div>
            </div>
            <div className={styles.cardType}>
              {type === "settled" ? "Settled" : "Unsettled"}
            </div>
          </div>

          <div className={styles.dataSection}>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>{primaryTitle}</span>
              <div className={styles.amountWrapper}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>
                  {primaryAmount
                    ? formatToINRCurrency(primaryAmount).replace("₹", "")
                    : "0.00"}
                </span>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>{secondaryTitle}</span>
              <div className={styles.amountWrapper}>
                <span className={styles.currency}>₹</span>
                <span className={styles.amount}>
                  {secondaryAmount
                    ? formatToINRCurrency(secondaryAmount).replace("₹", "")
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
            {/* <span className={styles.progressLabel}>
              {type === "settled" ? "Processing Complete" : "Processing..."}
            </span> */}
          </div>

          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
            <div className={styles.mesh}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementCard;
