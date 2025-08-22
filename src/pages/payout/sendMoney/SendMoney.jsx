import { useEffect, useState } from "react";
import { sendMoney } from "../../../forms/payout";
import { validateSendMoneyForm } from "../../../formValidations/sendMoneyForm";
import usePost from "../../../hooks/usePost";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Add.module.css";
import classes from "../../../styles/sendMoney/SendMoney.module.css";

import useFetch from "../../../hooks/useFetch";
import { roundAmount } from "../../../utils/roundAmount";
import { errorMessage, successMessage } from "../../../utils/messges";

const SendMoney = () => {
  const { fetchData: getAmount, data: amount } = useFetch();
  useEffect(() => {
    getAmount(endpoints.user.balance);
  }, []);
  // form handlers
  const [formData, setFormData] = useState(sendMoney);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payout.sendMoney
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateSendMoneyForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }

    await postData(formData);
    e.target.reset();
  };

  useEffect(() => {
    if (data?.statusCode < 400 && !error) {
      if (data?.statusCode === 201) {
        successMessage("Transaction Created Successfully");
      } else {
        successMessage(data?.data || "Transaction Successful");
      }
      setFormData(sendMoney);
    }
    if (data?.statusCode >= 400 || error) {
      errorMessage(data?.data || "Something went wrong, please try again.");
    }
  }, [error, data]);

  if (amount) {
    return (
      <DashboardLayout page="Send Money" url="/dashboard/send-money">
        <div className="container">
          <div className={styles.listing} style={{ width: "60vw" }}>
            <div className={classes.sendmoney}>
              <h6>
                <i className="bi bi-bank"></i> Available Balance
              </h6>
              <button>&#8377; {roundAmount(amount.data.accountBalance)}</button>
            </div>
          </div>
          <div className={styles.listing} style={{ width: "60vw" }}>
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-wrap gap-3 ">
                <div className={styles.input}>
                  <label htmlFor="orderId">
                    Transfer ID <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    id="orderId"
                    placeholder="Enter Transfer Id"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.orderId}
                    required
                  />
                  {errors.orderId && (
                    <span className="errors">{errors.orderId}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="name">
                    Beneficiary Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Beneficiary Name"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                  {errors.name && <span className="errors">{errors.name}</span>}
                </div>
                <div className={styles.input}>
                  <label htmlFor="nickname">
                    Nick Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    id="nickname"
                    placeholder="Enter Nick Name"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.nickname}
                    required
                  />
                  {errors.nickname && (
                    <span className="errors">{errors.nickname}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="mobile">
                    Mobile <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    placeholder="Enter Mobile Number"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.mobile}
                    required
                  />
                  {errors.mobile && (
                    <span className="errors">{errors.mobile}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                  {errors.email && (
                    <span className="errors">{errors.email}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="transactionAmmount">
                    Amount <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="transactionAmmount"
                    id="transactionAmmount"
                    placeholder="Enter Transfer amount"
                    autoComplete="on"
                    maxLength={256}
                    onChange={handleChange}
                    value={formData.transactionAmmount}
                    required
                  />
                  {errors.transactionAmmount && (
                    <span className="errors">{errors.transactionAmmount}</span>
                  )}
                </div>
                <div className={styles.input}>
                  <label htmlFor="transactionBankTransferMode">
                    Mode of Transaction <span className="required">*</span>
                  </label>
                  <select
                    name="transactionBankTransferMode"
                    id="transactionBankTransferMode"
                    defaultValue=""
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      --Select Mode of Transaction--
                    </option>
                    <option value="NEFT">NEFT</option>
                    <option value="IFT">IFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="IMPS">IMPS</option>
                    <option value="UPI">UPI</option>
                  </select>
                  {errors.transactionBankTransferMode && (
                    <span className="errors">
                      {errors.transactionBankTransferMode}
                    </span>
                  )}
                </div>
                {formData.transactionBankTransferMode !== "UPI" && (
                  <div className={styles.input}>
                    <label htmlFor="accountNo">
                      Account Number <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="accountNo"
                      id="accountNo"
                      placeholder="Enter Account Number"
                      autoComplete="on"
                      maxLength={256}
                      onChange={handleChange}
                      value={formData.accountNo}
                      required
                    />
                    {errors.accountNo && (
                      <span className="errors">{errors.accountNo}</span>
                    )}
                  </div>
                )}
                {formData.transactionBankTransferMode === "UPI" && (
                  <div className={styles.input}>
                    <label htmlFor="vpaAddress">
                      VPA Address <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="vpaAddress"
                      id="vpaAddress"
                      placeholder="Enter VPA Address"
                      autoComplete="on"
                      maxLength={256}
                      onChange={handleChange}
                      value={formData.vpaAddress}
                      required
                    />
                    {errors.vpaAddress && (
                      <span className="errors">{errors.vpaAddress}</span>
                    )}
                  </div>
                )}
                {formData.transactionBankTransferMode !== "UPI" && (
                  <div className={styles.input}>
                    <label htmlFor="ifscCode">
                      IFSC Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      id="ifscCode"
                      placeholder="Enter IFSC code"
                      autoComplete="on"
                      maxLength={256}
                      onChange={handleChange}
                      value={formData.ifscCode}
                      required
                    />
                    {errors.ifscCode && (
                      <span className="errors">{errors.ifscCode}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="d-flex gap-3 mt-3 justify-content-end">
                <button
                  className={
                    !loading
                      ? styles.submit + " " + styles.active
                      : styles.submit
                  }
                  type="submit"
                >
                  Transfer
                </button>
                <button
                  className={styles.clear}
                  type="reset"
                  onClick={() => setFormData(sendMoney)}
                >
                  clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }
};

export default SendMoney;
