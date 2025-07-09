import { Fragment } from "react";
import { createPortal } from "react-dom";
import styles from "../page.module.css";
import Link from "next/link";
const Backdrop = () => {
  return <div className="backdrop"></div>;
};

const Overlay = ({ name, onClick, data, isAdmin }) => {
  console.log(isAdmin);
  
  return (
    <div className="overlay w-50">
      <h6>Transaction Details</h6>
      <h5 id="username">Merchant Name: &nbsp; {name}</h5>
      <small>
        Currency:&nbsp;<b>{data.transactionId}</b>
      </small>
      <small>Country:&nbsp;{data.createdDate}</small>

      <div className="row">
        <div className="col-12 mb-2">
          <h4>Order Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Order Id</td>
                <td>{data.orderId}</td>
                <td>Transaction Id</td>
                <td>{data.ordRequestId}</td>
              </tr>
              <tr>
                <td>Amount</td>
                <td>
                  <b>{data.payableAmount || 0.0}</b>
                </td>
                <td>Transfer Mode</td>
                <td>
                  <b>{data.dueAmount || 0.0}</b>
                </td>
              </tr>
              <tr>
                <td>Txn Status</td>
                <td>{data.merchantCharges || 0.0}</td>
                <td>Txn Type</td>
                <td>
                  <b>{data.transactionStatus || "NA"}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>Txn Status Message</td>
                <td colSpan={2}>{data.transactionType || "NA"}</td>
              </tr>
              <tr>
                <td>UTR Number</td>
                <td>{data.utrNumber || "NA"}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 mb-2">
          <h4>Beneficiary Details</h4>
          <table className="table table-sm" id={styles.transactionTable}>
            <tbody>
              <tr>
                <td>Payment Type</td>
                <td>{data.paymentType?.paymentTypeName || "NA"}</td>{" "}
                <td>MOP Type</td>
                <td>{data.mopType?.mopTypeName || "NA"}</td>
              </tr>
              <tr>
                <td>Cutomer Name</td>
                <td>{data.customerName || "NA"}</td>
                <td>Customer Email</td>
                <td>{data.customerEmail || "NA"}</td>
              </tr>
              <tr>
                <td>Customer Contact No.</td>
                <td>{data.customerContactNumber || "NA"}</td>
                <td>Country Code</td>
                <td>{data.countryCode || "NA"}</td>
              </tr>
              <tr>
                <td>Currency Code</td>
                <td>{data.currencyCode || "NA"}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        {isAdmin && (
          <div className="col-12 mb-2">
            <h4>Acquirer Details</h4>
            <table className="table table-sm" id={styles.transactionTable}>
              <tbody>
                <tr>
                  <td>Acquirer Name</td>
                  <td>{data.acquirerCode || "NA"}</td>
                  <td>Acquirer Code</td>
                  <td>{data.acquirerOrderId || "NA"}</td>
                </tr>
                <tr>
                  <td>Acquirer Status</td>
                  <td>{data.acquirerTxnStatus || "NA"}</td>
                  <td>Acquirer Status Code</td>
                  <td>{data.acquirerTxnDate || "NA"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="d-flex mt-1">
        <button onClick={onClick}>Close</button>
      </div>
    </div>
  );
};

const TransactionDetails = ({ name, onClose, data, isAdmin }) => {
  return (
    <Fragment>
      {createPortal(
        <Backdrop onClick={onClose} />,
        document.getElementById("backdrop")
      )}
      {createPortal(
        <Overlay name={name} onClick={onClose} data={data} isAdmin={isAdmin} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default TransactionDetails;
