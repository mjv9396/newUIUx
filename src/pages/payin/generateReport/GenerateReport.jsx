/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../../../styles/common/Modal.module.css";
import classes from "../../../styles/common/add.module.css";
import { DateRangePicker } from "react-date-range";
import { GetUserRole } from "../../../services/cookieStore";
import usePost from "../../../hooks/usePost";
import { downloadReport } from "../../../forms/payin";


import { successMessage } from "../../../utils/messges";
const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Overlay = ({ url, allMerchant, onClose }) => {
  const { postData, data, loading, error } = usePost(url);

  const [range, setRange] = useState([
    {
      startDate: new Date(), // Yesterday
      endDate: new Date(), // Today
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const handleSelect = (ranges) => {
    setRange([ranges.selection]);
    setShowPicker(false); // Hide picker after selecting dates
  };
  // form handlers
  const [formData, setFormData] = useState(downloadReport);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!error && data) {
      successMessage("Report generated successfully");
    }
  }, [error, data]);

  return (
    <div className={styles.modal + " " + styles.view}>
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Generate Report</h6>
        <span className="bi bi-x" id={styles.cross} onClick={onClose}></span>
      </div>
      <div className={styles.detail + " " + styles.view}>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          {GetUserRole() === "ADMIN" && (
            <div className={styles.input}>
              <label htmlFor="userId">
                Merchant <span className="required">*</span>
              </label>
              <select
                name="userId"
                id="userId"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="">--All--</option>
                {allMerchant?.data.length > 0 ? (
                  allMerchant.data.map((item) => (
                    <option key={item.userId} value={item.userId}>
                      {item.firstName} {item.lastName}
                    </option>
                  ))
                ) : (
                  <option>No merchant added</option>
                )}
              </select>
            </div>
          )}
          <div className={styles.input}>
            <label htmlFor="txnStatus">
              Transaction Status <span className="required">*</span>
            </label>
            <select
              name="txnStatus"
              id="txnStatus"
              defaultValue=""
              onChange={handleChange}
            >
              <option value="" disabled>
                --Select transaction status--
              </option>
              <option value="PENDING">PENDING</option>
              <option value="REJECTED">REJECTED</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div className={styles.input}>
            <label htmlFor="userId" onChange={handleChange}>
              Enter Date Range <span className="required">*</span>
            </label>
            <br />
            <input
              type="text"
              name="dateFrom"
              readOnly
              value={`${range[0].startDate.toLocaleDateString()} - ${range[0].endDate.toLocaleDateString()}`}
              onClick={() => setShowPicker(!showPicker)}
              style={{ cursor: "pointer", width: "300px", padding: "10px" }}
            />
            {showPicker && (
              <div style={{ position: "absolute", zIndex: 1000 }}>
                <DateRangePicker ranges={range} onChange={handleSelect} />
              </div>
            )}
          </div>
          <div className="d-flex gap-3 mt-3 justify-content-end">
            <button
              className={
                !loading ? classes.submit + " " + classes.active : styles.submit
              }
              type={loading ? "button" : "submit"}
              onClick={() => postData(formData)}
              disabled={loading}
            >
              Generate
            </button>
            <button
              className={classes.clear}
              type="reset"
              onClick={() => setFormData(downloadReport)}
            >
              clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const GenerateReport = ({ url, allMerchant, onClose }) => {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay url={url} allMerchant={allMerchant} onClose={onClose} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default GenerateReport;
