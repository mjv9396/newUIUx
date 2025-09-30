import React from "react";
import { useNavigate } from "react-router-dom";
import { successMessage } from "../../../utils/messges";
import { formatToINRCurrency } from "../../../utils/formatToINRCurrency ";
import styles from "./VirtualAccountCard3D.module.css";
import { GetUsername } from "../../../services/cookieStore";

const VirtualAccountCard3D = ({
  title = "",
  amt = 0,
  accountNo = 0,
  ifsc = 0,
  vpa = "",
  
}) => {
  const navigate = useNavigate();

  const handleCopy = (text, message, event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    successMessage(message);
  };

  const handleCardClick = () => {
    navigate("/virtual-account");
  };

  return (
    <div className={styles.cardContainer} onClick={handleCardClick}>
      <div className={styles.card}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div className={styles.bankLogo}>
            {/* <div className={styles.logoShape}> */}
              <span style={{marginTop: '10px'}} className={styles.logoText}>{title}</span>
            {/* </div> */}
          </div>
          <div className={styles.cardType}>
            <span className={styles.cardTypeText}>VIRTUAL</span>
            <span className={styles.cardSubText}>ACCOUNT</span>
          </div>
        </div>

        {/* Card Body */}
        <div className={styles.cardBody}>
          {vpa ? (
            <div className={styles.accountSection}>
              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>UPI ID</span>
                <div className={styles.fieldValue}>
                  <span className={styles.accountText}>{vpa}</span>
                  <button
                    className={styles.copyButton}
                    onClick={(e) =>
                      handleCopy(vpa, "VPA copied to clipboard", e)
                    }
                    title="Copy VPA"
                  >
                    <i className="bi bi-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.accountSection}>
              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>ACCOUNT</span>
                <div className={styles.fieldValue}>
                  <span className={styles.accountText}>
                    {accountNo}
                  </span>
                  <button
                    className={styles.copyButton}
                    onClick={(e) =>
                      handleCopy(
                        accountNo,
                        "Account Number copied to clipboard",
                        e
                      )
                    }
                    title="Copy Account"
                  >
                    <i className="bi bi-copy"></i>
                  </button>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>IFSC CODE</span>
                <div className={styles.fieldValue}>
                  <span className={styles.accountText}>{ifsc}</span>
                  <button
                    className={styles.copyButton}
                    onClick={(e) =>
                      handleCopy(ifsc, "IFSC Code copied to clipboard", e)
                    }
                    title="Copy IFSC"
                  >
                    <i className="bi bi-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        {/* <div className={styles.cardFooter}>
          <div className={styles.balanceSection}>
            <span className={styles.balanceLabel}>Available Balance</span>
            <div className={styles.balanceAmount}>
              <span className={styles.currency}>₹</span>
              <span className={styles.amount}>
                {amt
                  ? formatToINRCurrency(amt).replace("₹", "").replace(",", ",")
                  : "0.00"}
              </span>
            </div>
          </div>
          <div className={styles.cardChip}>
            <div className={styles.chip}></div>
          </div>
        </div> */}

        {/* Card Design Elements */}
        <div className={styles.cardPattern}>
          <div className={styles.patternDot}></div>
          <div className={styles.patternDot}></div>
          <div className={styles.patternDot}></div>
        </div>

        <div className={styles.cardGradient}></div>
      </div>
    </div>
  );
};

export default VirtualAccountCard3D;
