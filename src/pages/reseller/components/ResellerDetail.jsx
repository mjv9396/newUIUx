/* eslint-disable react/prop-types */
import styles from "../../../styles/common/Modal.module.css";
import { Fragment } from "react";
import { createPortal } from "react-dom";
const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};
const Overlay = ({ data, onClose }) => {
  return (
    <div className={styles.modal}>
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Reseller Details</h6>
        <span className="bi bi-x" id={styles.cross} onClick={onClose}></span>
      </div>
      <div className={styles.detail}>
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
                colSpan={4}
                style={{
                  background: "#bbcef0",
                  color: "black",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Personal Details
              </td>
            </tr>
            <tr>
              <td>User Id</td>
              <td>{data.userId}</td>
              <td>First Name</td>
              <td>{data.firstName}</td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>{data.lastName}</td>
              <td>Email</td>
              <td>{data.email}</td>
            </tr>
            <tr>
              <td>Phone Number</td>
              <td>{data.phoneNumber}</td>
              <td>APP ID</td>
              <td>
                <b>{data.appId}</b>
              </td>
            </tr>
            <tr>
              <td>Secret Key</td>
              <td>
                <b>{data.secretkey}</b>
              </td>
              <td>Account Status</td>
              <td>{data.userAccountState}</td>
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
                Business Details
              </td>
            </tr>
            <tr>
              <td>Business Name</td>
              <td>{data.businessName}</td>
              <td>Organisation Type</td>
              <td>{data.organisationType}</td>
            </tr>
            <tr>
              <td>Industry Category</td>
              <td>{data.industryCategory}</td>
              <td>Industory Sub Category</td>
              <td>{data.industrySubCategory || "NA"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
const ResellerDetail = ({ data, onClose }) => {
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

export default ResellerDetail;
