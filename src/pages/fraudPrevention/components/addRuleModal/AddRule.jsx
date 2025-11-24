/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import styles from "./AddRule.module.css";
import { createPortal } from "react-dom";
import usePost from "../../../../hooks/usePost";
import { endpoints } from "../../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../../utils/messges";
import {
  validateEmail,
  validateVpa,
  validateContact,
  validateIPAddress,
  validateURL,
  validateEmpty,
} from "../../../../utils/validations";
const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Overlay = ({
  userId,
  type,
  onSuccess,
  placeholder = "Enter Value",
  onClose,
}) => {
  const [error, setError] = useState("");
  const {
    postData,
    error: apiError,
    data,
  } = usePost(endpoints.fraud.fraudPrevention);

  // Determine validation function based on type
  const getValidationFunction = (ruleType) => {
    const typeLower = ruleType.toLowerCase();

    if (typeLower.includes("email")) return validateEmail;
    if (typeLower.includes("vpa")) return validateVpa;
    if (typeLower.includes("phone") || typeLower.includes("mobile"))
      return validateContact;
    if (typeLower.includes("ip")) return validateIPAddress;
    if (
      typeLower.includes("url") ||
      typeLower.includes("domain") ||
      typeLower.includes("callback") ||
      typeLower.includes("return")
    )
      return validateURL;

    return validateEmpty; // Default validation
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputValue = e.target.value.value.trim();

    // Get appropriate validation function
    const validationFn = getValidationFunction(type);
    const validationError = validationFn(inputValue);

    if (validationError) {
      setError(validationError);
      errorMessage(validationError);
      return;
    }

    setError("");
    await postData({ type, userId, value1: inputValue });
  };
  useEffect(() => {
    if (data && !apiError) {
      successMessage("data added successfully");
      onSuccess();
      onClose();
    }
  }, [data, apiError]);
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
              Value <span className="required">*</span>
            </label>
            <input
              type="text"
              id="value"
              name="value"
              placeholder={placeholder}
              maxLength={256}
              onChange={() => setError("")}
              required
            />
            {error && <span className="errors">{error}</span>}
          </div>
          <div className="d-flex mt-4">
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AddRule = ({ userId, type, placeholder, onSuccess, onClick }) => {
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

export default AddRule;
