/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "../../../../styles/common/Modal.module.css";
import classes from "../../../../styles/common/Add.module.css";
import { createPortal } from "react-dom";

const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const RefundModel = ({ data, onClose }) => {
  const [refundAmount, setRefundAmount] = useState(data.amount);

  const handleAmountChange = (e) => {
    setRefundAmount(e.target.value);
  };

  const handleSubmit = () => {
    // console.log({
    //   refundAmount,
    //   orderId: data.orderId,
    //   txnId: data.txnId,
    // });
    onClose();
  };

  return (
    <>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <div
          style={{
            height: "50vh",
            width: "50vw",
          }}
          className={styles.modal}
        >
          <div
            className="d-flex justify-content-between position-sticky top-0 z-2 bg-white py-4 pb-0"
            id={styles.title}
          >
            <h6>Refund Transaction</h6>
            <span
              className="bi bi-x mx-3"
              id={styles.cross}
              onClick={onClose}
              style={{ cursor: "pointer" }}
            ></span>
          </div>

          <div className="row my-1">
            <div className="col-sm-12 ">
              <table className="table table-bordered">
                <thead className="hidden"></thead>
                <tbody>
                  <tr>
                    <td>Order ID</td>
                    <td>{data.orderId}</td>
                  </tr>
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>Transaction ID</td>
                    <td>{data.txnId}</td>
                  </tr>
                  <tr>
                    <td>Amount</td>
                    <td>{data.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <form
            style={{
              maxHeight: "35vh",
              border: "none",
            }}
            className={styles.detail}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div style={{ position: "relative", gap:4, display: "flex", alignItems: "center" }} className="mb-3 ">
              <label>Refund Amount:</label>
              <input
                onWheel={(e) => e.target.blur()}
                style={{ maxWidth: "150px" }}
                type="number"
                min="1"
                max={data.amount}
                value={refundAmount}
                onChange={handleAmountChange}
                placeholder="Enter refund amount"
              />
              <button
                className={classes.submit + " " + classes.active}
                style={{ whiteSpace: "nowrap", width: "auto" }}
                type="submit"
              >
                Refund
              </button>
            </div>

            <div className="d-flex justify-content-end">
              
            </div>
          </form>
        </div>,
        document.getElementById("overlay")
      )}
    </>
  );
};

export default RefundModel;
