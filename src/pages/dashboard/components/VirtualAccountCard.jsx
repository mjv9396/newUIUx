import { useNavigate } from "react-router-dom";
import styles from "../../../styles/dashboard/Dashboard.module.css";
import { successMessage } from "../../../utils/messges";

const VirtualAccountCard = ({
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

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate("/virtual-account");
      }}
      className={styles.virtualCard}
    >
      <h4>{title}</h4>
      {/* <h4>{formatToINRCurrency(amt)}</h4> */}

      {vpa ? (
        <>
          {" "}
          <small>
            Virtual VPA{" "}
            <i
              onClick={(e) => handleCopy(vpa, "VPA copied to clipboard", e)}
              className="bi bi-copy"
            ></i>
          </small>
          <h5>{vpa}</h5>
        </>
      ) : (
        <>
          <small>
            Account Number{" "}
            <i
              onClick={(e) =>
                handleCopy(accountNo, "Account Number copied to clipboard", e)
              }
              className="bi bi-copy"
            ></i>
          </small>
          <h5>{accountNo}</h5>
          <small>
            IFSC Code{" "}
            <i
              onClick={(e) =>
                handleCopy(ifsc, "IFSC Code copied to clipboard", e)
              }
              className="bi bi-copy"
            ></i>
          </small>
          <h5>{ifsc}</h5>
        </>
      )}
    </div>
  );
};

export default VirtualAccountCard;
