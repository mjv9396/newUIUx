/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "../../../styles/merchant/Merchant.module.css";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";

import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../../utils/messges";
const BankDetails = ({
  userId,
  panCard,
  bankName,
  branchName,
  accountNo,
  ifscCode,
  accHolderName,
  accountBalance,
  currency,
  ...rest
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId,
    panCard,
    bankName,
    branchName,
    accountNo,
    ifscCode,
    accHolderName,
    accountBalance,
    currency,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "accountBalance" && !/^\d+(\.\d{0,2})?$/.test(value)) {
      errorMessage("Invalid Amount should be upto 2 decimal places only");
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const { postData, data, error } = usePost(endpoints.user.updateUser);

  const handleUpdateData = async () => {
    await postData(formData);
  };
  useEffect(() => {
    if (data && !error) {
      const updatedState = { ...rest, ...formData };
      successMessage("details updated successfully");
      navigate("/update-merchant", { state: updatedState });
    }
  }, [error, data]);
  return (
    <div>
      <h6>Bank Details</h6>
      <div className="d-flex flex-wrap gap-3 mt-3">
        <div className={styles.input} style={{ minWidth: "17rem" }}>
          <label htmlFor="bankName">
            Bank Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="bankName"
            id="bankName"
            placeholder="Enter Bank Name"
            autoComplete="on"
            maxLength={256}
            defaultValue={bankName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input} style={{ minWidth: "17rem" }}>
          <label htmlFor="accountNo">
            Account Number <span className="required">*</span>
          </label>
          <input
            type="text"
            name="accountNo"
            id="accountNo"
            placeholder="Enter Account Number"
            autoComplete="on"
            maxLength={256}
            defaultValue={accountNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input} style={{ minWidth: "17rem" }}>
          <label htmlFor="ifscCode">
            IFSC Code <span className="required">*</span>
          </label>
          <input
            type="text"
            name="ifscCode"
            id="ifscCode"
            placeholder="Enter IFSC Code"
            autoComplete="on"
            maxLength={256}
            defaultValue={ifscCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input} style={{ minWidth: "17rem" }}>
          <label htmlFor="branchName">
            Branch Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="branchName"
            id="branchName"
            placeholder="Enter Branch Name"
            autoComplete="on"
            maxLength={256}
            defaultValue={branchName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input} style={{ minWidth: "17rem" }}>
          <label htmlFor="accHolderName">
            Account Holder Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="accHolderName"
            id="accHolderName"
            placeholder="Enter Account Holder Name"
            autoComplete="on"
            maxLength={256}
            defaultValue={accHolderName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="accountBalance">
            Account Balance <span className="required">*</span>
          </label>
          <input
            type="text"
            name="accountBalance"
            id="accountBalance"
            placeholder="Enter Account Balance"
            autoComplete="on"
            maxLength={256}
            defaultValue={accountBalance}
            onChange={handleChange}
            required
            value={formData.accountBalance}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="currency">
            Currency <span className="required">*</span>
          </label>
          <input
            type="text"
            name="currency"
            id="currency"
            placeholder="Enter Currency"
            autoComplete="on"
            maxLength={256}
            defaultValue={currency}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="panCard">
            PAN Card <span className="required">*</span>
          </label>
          <input
            type="text"
            name="panCard"
            id="panCard"
            placeholder="Enter Pancard"
            autoComplete="on"
            maxLength={256}
            defaultValue={panCard}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button className={styles.update} onClick={handleUpdateData}>
          Update
        </button>
      </div>
    </div>
  );
};

export default BankDetails;
