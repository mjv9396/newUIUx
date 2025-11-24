/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import styles from "./AddRule.module.css";
import { createPortal } from "react-dom";
import usePost from "../../../../hooks/usePost";
import { endpoints } from "../../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../../utils/messges";
import { validateAmount } from "../../../../utils/validations";
const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Overlay = ({ userId, type, onSuccess, onClose }) => {
  const [errors, setErrors] = useState({ value: "", value2: "" });
  const { postData, error, data } = usePost(endpoints.fraud.fraudPrevention);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startAmount = e.target.value.value.trim();
    const endAmount = e.target.value2.value.trim();

    // Validate both amounts
    const startError = validateAmount(startAmount, 1, 10000000);
    const endError = validateAmount(endAmount, 1, 10000000);

    if (startError || endError) {
      setErrors({
        value: startError || "",
        value2: endError || "",
      });
      errorMessage("Please correct the amount errors");
      return;
    }

    // Check if start is less than end
    if (parseFloat(startAmount) >= parseFloat(endAmount)) {
      setErrors({
        value: "",
        value2: "End amount must be greater than start amount",
      });
      errorMessage("End amount must be greater than start amount");
      return;
    }

    setErrors({ value: "", value2: "" });
    await postData({
      type,
      userId,
      value: startAmount,
      value2: endAmount,
    });
  };
  useEffect(() => {
    if (data && !error) {
      successMessage("data added successfully");
      onSuccess();
      onClose();
    }
  }, [data, error]);
  return (
    <div className={styles.modal}>
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Add {type}</h6>
        <i className="bi bi-x" onClick={onClose}></i>
      </div>
      <div className={styles.detail}>
        <form onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="value">
              Starting Amount Limit <span className="required">*</span>
            </label>
            <input
              type="text"
              id="value"
              name="value"
              placeholder="Enter min amount (e.g., 100.00)"
              maxLength={12}
              onChange={() => setErrors({ ...errors, value: "" })}
              required
            />
            {errors.value && <span className="errors">{errors.value}</span>}
          </div>
          <div className="">
            <label htmlFor="value2">
              End Amount Limit <span className="required">*</span>
            </label>
            <input
              type="text"
              id="value2"
              name="value2"
              placeholder="Enter max amount (e.g., 50000.00)"
              maxLength={12}
              onChange={() => setErrors({ ...errors, value2: "" })}
              required
            />
            {errors.value2 && <span className="errors">{errors.value2}</span>}
          </div>
          <div className="d-flex mt-4">
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AddAmountLimit = ({ userId, type, placeholder, onSuccess, onClick }) => {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay
          userId={userId}
          type={type}
          onSuccess={onSuccess}
          onClose={onClick}
          placeholder={placeholder}
        />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddAmountLimit;
