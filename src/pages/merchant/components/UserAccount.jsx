/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "../../../styles/merchant/Merchant.module.css";
import { useNavigate } from "react-router-dom";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";

import { successMessage } from "../../../utils/messges";
const UserAccount = ({
  firstName,
  lastName,
  secretkey,
  userAccountState,
  payinTransactionType,
  userId,
  ...rest
}) => {
  const navigate = useNavigate();
  const [viewSecretKey, setViewSecretKey] = useState(false);
  const [formData, setFormData] = useState({
    userId,
    userAccountState,
    payinTransactionType,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const { postData: updateStatus } = usePost(
    endpoints.user.updateAccountStatus
  );
  const {
    postData: updateUser,
    data: updateUserData,
    error: updateUserError,
  } = usePost(endpoints.user.updateUser);
  const handleUpdateData = async () => {
    await updateStatus({
      userId: userId,
      userAccountState: formData.userAccountState,
    });
    await updateUser({
      userId: userId,
      payinTransactionType: formData.payinTransactionType,
    });
  };
  useEffect(() => {
    if (updateUserData && !updateUserError) {
      const updatedState = {
        ...rest,
        ...formData,
        firstName,
        lastName,
        secretkey,
      };
      successMessage("details updated successfully");
      navigate("/update-merchant", { state: updatedState });
    }
  }, [updateUserError, updateUserData]);
  return (
    <div>
      <h6>User Account Details</h6>
      <div className="d-flex flex-wrap gap-3">
        <div className={styles.input}>
          <label htmlFor="mopName">
            Merchant Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={firstName + lastName}
            readOnly
            disabled
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="mopName">
            Secret Key <span className="required">*</span>
          </label>

          <input
            type={viewSecretKey ? "text" : "password"}
            name="key"
            id="key"
            maxLength={256}
            value={secretkey}
            disabled
            readOnly
          />
          <i
            className="bi bi-eye-slash-fill"
            onClick={() => setViewSecretKey(!viewSecretKey)}
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              cursor: "pointer",
            }}
          ></i>
        </div>
        <div className={styles.input}>
          <label htmlFor="mopName">
            Account Status <span className="required">*</span>
          </label>
          <select
            name="userAccountState"
            id="userAccountState"
            defaultValue={userAccountState}
            onChange={handleChange}
          >
            <option value="" disabled>
              --Select account status--
            </option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="TRANSACTION BLOCK">TRANSACTION BLOCK</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
        <div className={styles.input}>
          <label htmlFor="mopName">
            Payin Transaction Type <span className="required">*</span>
          </label>
          <select
            name="payinTransactionType"
            id="payinTransactionType"
            onChange={handleChange}
            defaultValue={payinTransactionType}
          >
            <option value="" disabled>
              --Select Transaction Type--
            </option>
            <option value="SALE">SALE</option>
            <option value="AUTHORISE">AUTH</option>
          </select>
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

export default UserAccount;
