/* eslint-disable react/prop-types */
import { Fragment, useState } from 'react';
import styles from "../../../../styles/common/Modal.module.css";
import classes from "../../../../styles/common/Add.module.css";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GetUserRole } from "../../../../services/cookieStore";
import RefundModel from './RefundModel';
const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};
const Overlay = ({ data, onClose }) => {
  const navigate = useNavigate();
  const [showRefund, setShowRefund] = useState(false);
  return (
    <div className={styles.modal}>
      {showRefund && (
        <RefundModel data={data} onClose={() => setShowRefund(false)} />
      )}
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Transaction Details</h6>
        <span className="d-flex gap-2 align-items-center">
          {GetUserRole() === "ADMIN" && (
            <>
              <button
                onClick={() =>
                  navigate(`/payin/chargeBack`, { state: { data } })
                }
                className={classes.submit + " " + classes.active}
              >
                Raise Dispute
              </button>
              <button
                className={classes.submit + " " + classes.active}
                onClick={() => setShowRefund(true)}
              >
                Refund
              </button>
            </>
          )}
          <span
            className="bi bi-x mx-3"
            id={styles.cross}
            onClick={onClose}
          ></span>
        </span>
      </div>
      <div className={styles.detail}>
        <div className="row">
          <div className="col-lg-7 col-md-12 col-sm-12 ">
            <table className="table table-borderless">
              <thead className="hidden">
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      background: "#bbcef0",
                      color: "black",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                    colSpan={4}
                  >
                    Transaction Details
                  </td>
                </tr>
                <tr>
                  <td>Transaction Id</td>
                  <td>{data.txnId}</td>
                  <td>Order Id</td>
                  <td>{data.orderId}</td>
                </tr>
                <tr>
                  <td>Merchant Name</td>
                  <td></td>
                  <td>Product Description</td>
                  <td>{data.productDesc}</td>
                </tr>
                <tr>
                  <td>Customer Email</td>
                  <td>{data.custEmail}</td>
                  <td>Customer Phone</td>
                  <td>{data.custPhone}</td>
                </tr>
                <tr>
                  <td>Currency Code</td>
                  <td>{data.currencyCode}</td>
                  <td>Amount</td>
                  <td>{data.amount}</td>
                </tr>
                <tr>
                  <td>Transaction Type</td>
                  <td>{data.transactionType}</td>
                  <td>Transaction Status</td>
                  <td>{data.txnStatus}</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      background: "#93b893",
                      color: "black",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Bank Details
                  </td>
                </tr>
                <tr>
                  <td>Payment Type Code</td>
                  <td>{data.paymentTypeCode}</td>
                  <td>Mop Type Code</td>
                  <td>{data.mopCode}</td>
                </tr>
                <tr>
                  <td>UTR</td>
                  <td>{data.utr}</td>
                  <td>PG Refrence No.</td>
                  <td>{data.pgRefNum || "NA"}</td>
                </tr>
                <tr>
                  <td>Card Number</td>
                  <td>{data.cardNumber}</td>
                  <td>VPA</td>
                  <td>{data.custVpa}</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      background: "#e1caac",
                      color: "black",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Other Details
                  </td>
                </tr>
                <tr>
                  <td>Country Code</td>
                  <td>{data.countryCode || "NA"}</td>
                  <td>Response Code</td>
                  <td>{data.responseCode}</td>
                </tr>
                <tr>
                  <td>Response Message</td>
                  <td>{data.responseMessage}</td>
                  <td>IP Address</td>
                  <td>{data.ipAddress}</td>
                </tr>
                <tr>
                  <td>User Agent</td>
                  <td>{data.userAgent}</td>
                  <td>Return URL</td>
                  <td>{data.returnUrl}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-lg-5 col-md-12 col-sm-12">
            <table className="table table-borderless">
              <thead className="hidden">
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      background: "lightblue",
                      color: "black",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Transaction History
                  </td>
                </tr>
                <tr>
                  <td>
                    <div id={styles["timeline-container"]}>
                      <div className={styles["inner-container"]}>
                        <ul className={styles.timeline}>
                          <li
                            className={styles["timeline-item"]}
                            data-date={data.createdDate}
                          >
                            <b className="text-info">PENDING</b> <br />
                            <b>Message</b> Transaction processing <br />
                            <b>Code</b> 001
                          </li>
                          {(data.txnStatus === "SUCCESS" ||
                            data.txnStatus === "SENTTOBANK") && (
                            <li
                              className={styles["timeline-item"]}
                              data-date={data.updatedDate}
                            >
                              <b className="text-warning">SEND TO BANK</b>
                              <br />
                              <b>Message</b> Transaction Request <br />
                              pending at bank
                              <br />
                              <b>Code</b> 002
                            </li>
                          )}
                          {data.txnStatus === "SUCCESS" && (
                            <li
                              className={styles["timeline-item"]}
                              data-date={data.updatedDate}
                            >
                              <b className="text-success">CAPTURED</b> <br />
                              <b>Message</b> SUCCESS <br />
                              <b>Code</b> 000
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
const ViewModal = ({ data, onClose }) => {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay data={data} onClose={onClose} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default ViewModal;
