/* eslint-disable react/prop-types */
import { Fragment } from "react";
import styles from "../../../../styles/common/Modal.module.css";
import classes from "../../../../styles/common/Add.module.css";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GetUserRole, isAdmin } from "../../../../services/cookieStore";

const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};
const Overlay = ({ data, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.modal}>
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Transaction Details</h6>
        <span className="d-flex gap-2 align-items-center">
          {GetUserRole() === "ADMIN" && (
            <>
              {/* <button
                onClick={() =>
                  navigate(`/payin/chargeBack`, { state: { data } })
                }
                className={classes.submit + " " + classes.active}
              >
                Raise Dispute
              </button> */}
              <button className={classes.submit + " " + classes.active}>
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
                  <td>Bussiness Name</td>
                  <td>{data?.businessName || "N/A"}</td>
                </tr>
                <tr>
                  <td>Order Id</td>
                  <td>{data?.orderId || "N/A"}</td>
                  <td>Transaction Id</td>
                  <td>{data?.transactionId || "N/A"}</td>
                </tr>
                <tr>
                  <td>Transaction Type</td>
                  <td>{data?.transactionType || "N/A"}</td>
                  <td>Transaction Status</td>
                  <td>{data?.transactionStatus || "N/A"}</td>
                </tr>
                <tr>
                  <td>Bank UTR</td>
                  <td>{data?.bankUtr || "N/A"}</td>
                  <td>Transction Date</td>
                  <td>{data?.dateOfIssue || "N/A"}</td>
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
                    Commercial Details
                  </td>
                </tr>
                <tr>
                  {isAdmin() && (
                    <>
                      <td>Bank</td>
                      <td>{data?.acquirer || "N/A"}</td>
                    </>
                  )}
                  <td>Transfer Mode</td>
                  <td>{data?.transactionBankTransferMode || "N/A"}</td>
                </tr>
                <tr>
                  <td>Merchant TDR</td>
                  <td>{data?.merchantTdr || "N/A"}</td>
                  {isAdmin() && (
                    <>
                      <td>PG Profit</td>
                      <td>{data?.pgProfit || "0.0"}</td>
                    </>
                  )}
                </tr>
                <tr>
                  <td>GST</td>
                  <td>{parseFloat(data?.gst)?.toFixed(2) || "N/A"}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>
                    {parseFloat(data?.transactionAmmount)?.toFixed(2) || "N/A"}
                  </td>
                  <td>Debit Amount</td>
                  <td>{parseFloat(data?.netAmount)?.toFixed(2) || "N/A"}</td>
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
                    Bank Details
                  </td>
                </tr>
                <tr>
                  <td>Beneficiary Name</td>
                  <td>{data?.beneficiary?.name || "N/A"}</td>
                  <td>Beneficiary Nickname</td>
                  <td>{data?.beneficiary?.nickname || "N/A"}</td>
                </tr>
                <tr>
                  <td>Beneficiary Email</td>
                  <td>{data?.beneficiary?.email || "N/A"}</td>
                  <td>Beneficiary Phone</td>
                  <td>{data?.beneficiary?.mobile || "N/A"}</td>
                </tr>
                <tr>
                  <td>Account No.</td>
                  <td>{data?.beneficiary?.accountNo || "N/A"}</td>
                  <td>IFSC Code</td>
                  <td>{data?.beneficiary?.ifscCode || "N/A"}</td>
                </tr>
                {isAdmin() && (
                  <tr>
                    <td>Bank Status</td>
                    <td>{data?.bankPoStatus || "N/A"}</td>
                    <td>Bank Status Message</td>
                    <td>{data?.bankPoStatusMsg || "N/A"}</td>
                  </tr>
                )}
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
                            data-date={data?.dateOfIssue || "N/A"}
                          >
                            <b className="text-info">PENDING</b> <br />
                            <b>Message</b> Transaction processing <br />
                            <b>Code</b> 001
                          </li>
                          {(data?.statusSubcode === "002" ||
                            parseInt(data?.statusSubcode) >= 0) && (
                            <li
                              className={styles["timeline-item"]}
                              data-date={data?.dateOfIssue || "N/A"}
                            >
                              <b className="text-warning">PROCESSING</b>
                              <br />
                              <b>Message</b> Transaction <br />
                              pending at bank
                              <br />
                              <b>Code</b> 002
                            </li>
                          )}
                          {data?.statusSubcode === "000" ? (
                            <li
                              className={styles["timeline-item"]}
                              data-date={data?.dateOfIssue || "N/A"}
                            >
                              <b className="text-success">SUCCESS</b> <br />
                              <b>Message</b> SUCCESS <br />
                              <b>Code</b> {data?.statusSubcode || "N/A"}
                            </li>
                          ) : data?.statusSubcode !== "001" ||
                            data?.statusSubcode !== "002" ? (
                            <li
                              className={styles["timeline-item"]}
                              data-date={data?.dateOfIssue || "N/A"}
                            >
                              <b className="text-danger">FAILED</b> <br />
                              <b>Message</b> Transaction failed <br />
                              <b>Code</b> {data?.statusSubcode || "N/A"}
                            </li>
                          ) : null}
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
const ViewPayoutModal = ({ data, onClose }) => {
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

export default ViewPayoutModal;
