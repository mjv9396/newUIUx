import { useEffect, useState } from "react";
import { internalTransfer } from "../../../forms/payout";
import { validateInternalTransferForm } from "../../../formValidations/internalTransferForm";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { endpoints } from "../../../services/apiEndpoints";
import styles from "../../../styles/common/Add.module.css";
import classes from "../../../styles/sendMoney/SendMoney.module.css";
import { roundAmount } from "../../../utils/roundAmount";
import { errorMessage, successMessage } from "../../../utils/messges";

const InternalTransfer = () => {
  const { fetchData: getBalance, data: balance } = useFetch();
  const { fetchData: getUserProfile, data: userProfile } = useFetch();
  const {
    fetchData: verifyMerchantAPI,
    data: merchantData,
    error: verifyError,
  } = useFetch();
  const {
    postData: performTransfer,
    data: transferData,
    error: transferError,
    loading: transferLoading,
  } = usePost(endpoints.payout.internalTransfer);

  // State management
  const [formData, setFormData] = useState(internalTransfer);
  const [errors, setErrors] = useState({});
  const [captchaText, setCaptchaText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [verifiedMerchant, setVerifiedMerchant] = useState(null);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    // Fetch wallet balance and user profile on component mount
    getBalance(endpoints.user.balance);
    getUserProfile(endpoints.user.fullProfile);
    generateCaptcha();
  }, []);

  // Handle merchant verification response
  useEffect(() => {
    if (merchantData?.statusCode < 400 && !verifyError) {
      setVerifiedMerchant(merchantData.data);
      setShowConfirmation(true);
    }
    if (merchantData?.statusCode >= 400 || verifyError) {
      const errorMsg =
        merchantData?.data || "Wrong App ID or App ID not available";
      errorMessage(errorMsg);
      generateCaptcha(); // Regenerate captcha on error
    }
  }, [merchantData, verifyError]);

  // Handle transfer response
  useEffect(() => {
    if (transferData?.statusCode < 400 && !transferError) {
      const successMsg =
        transferData?.data || "Transfer completed successfully!";
      successMessage(successMsg);
      setFormData(internalTransfer);
      setShowConfirmation(false);
      setVerifiedMerchant(null);
      getBalance(endpoints.user.balance); // Refresh balance
      generateCaptcha();
    }
    if (transferData?.statusCode >= 400 || transferError) {
      const errorMsg =
        transferData?.data || "Transfer failed. Please try again.";
      errorMessage(errorMsg);
    }
  }, [transferData, transferError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleVerifyMerchant = async (e) => {
    e.preventDefault();

    const maxBalance = balance?.data?.accountBalance || 0;
    const validationError = validateInternalTransferForm(formData, maxBalance);

    // Additional captcha validation
    if (formData.captcha !== captchaText) {
      validationError.captcha = "Invalid captcha";
    }

    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }

    // Call verify merchant API using hook
    await verifyMerchantAPI(
      `${endpoints.user.verifyMerchant}?appId=${formData.merchantAppId}`
    );
  };

  const handleConfirmTransfer = async () => {
    const transferPayload = {
      senderAppId: userProfile?.data?.appId || "APP123456", // Use actual user app ID
      receiverAppId: formData.merchantAppId,
      amount: parseFloat(formData.amount),
    };

    await performTransfer(transferPayload);
  };

  const handleCancelTransfer = () => {
    setShowConfirmation(false);
    setVerifiedMerchant(null);
    generateCaptcha();
  };

  if (balance) {
    return (
      <DashboardLayout
        page="Internal Transfer"
        url="/dashboard/internal-transfer"
      >
        <div className="container">
          <div className={styles.listing} style={{ width: "60vw" }}>
            <div className={classes.sendmoney}>
              <h6>
                <i className="bi bi-wallet2"></i> Available Wallet Balance
              </h6>
              <button style={{ fontSize: "18px", padding: "10px 20px" }}>
                &#8377; {roundAmount(balance.data.accountBalance)}
              </button>
            </div>
          </div>

          {!showConfirmation ? (
            <div className={styles.listing} style={{ width: "60vw" }}>
              <form onSubmit={handleVerifyMerchant}>
                <div className="row g-4">
                  <div className="col-md-5 col-lg-4">
                    <div className={styles.input}>
                      <label htmlFor="amount">
                        Amount <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        placeholder="Enter amount to transfer"
                        autoComplete="off"
                        min="1"
                        max="10000000"
                        step="0.01"
                        onChange={handleChange}
                        value={formData.amount}
                        required
                      />
                      {errors.amount && (
                        <span className="errors">{errors.amount}</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5 col-lg-4">
                    <div className={styles.input}>
                      <label htmlFor="merchantAppId">
                        Beneficiary App ID <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="merchantAppId"
                        id="merchantAppId"
                        placeholder="Enter beneficiary app ID"
                        autoComplete="off"
                        onChange={handleChange}
                        value={formData.merchantAppId}
                        required
                      />
                      {errors.merchantAppId && (
                        <span className="errors">{errors.merchantAppId}</span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5 col-lg-4">
                    <div className={styles.input}>
                      <label htmlFor="reenterMerchantAppId">
                        Re-enter Beneficiary App ID{" "}
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="reenterMerchantAppId"
                        id="reenterMerchantAppId"
                        placeholder="Re-enter beneficiary app ID"
                        autoComplete="off"
                        onChange={handleChange}
                        value={formData.reenterMerchantAppId}
                        required
                      />
                      {errors.reenterMerchantAppId && (
                        <span className="errors">
                          {errors.reenterMerchantAppId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5 col-lg-4">
                    <div className={styles.input}>
                      {/* <label htmlFor="captcha">
                        Captcha <span className="required">*</span>
                      </label> */}
                      <div className="d-flex gap-2 align-items-center mb-2">
                        <span
                          className="captcha-text w-100"
                          style={{
                            backgroundColor: "#f0f0f0",
                            padding: "12px 20px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                            fontSize: "18px",
                            fontWeight: "bold",
                            letterSpacing: "3px",
                            minWidth: "140px",
                            textAlign: "center",
                            height: "45px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {captchaText}
                        </span>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="btn btn-outline-secondary"
                          style={{ height: "45px", width: "45px" }}
                        >
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 col-lg-4">
                    <div className={styles.input}>
                      <label htmlFor="captcha">
                        Captcha <span className="required">*</span>
                      </label>
                      <div className="d-flex gap-2 align-items-center mb-2">
                        <input
                          type="text"
                          name="captcha"
                          id="captcha"
                          placeholder="Enter captcha"
                          autoComplete="off"
                          onChange={handleChange}
                          value={formData.captcha}
                          required
                        />
                        {errors.captcha && (
                          <span className="errors">{errors.captcha}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4 justify-content-end">
                  <button
                    className={styles.submit + " " + styles.active}
                    type="submit"
                  >
                    Verify Beneficiary
                  </button>
                  <button
                    className={styles.clear}
                    type="button"
                    onClick={() => {
                      setFormData(internalTransfer);
                      setErrors({});
                      generateCaptcha();
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.listing} style={{ width: "60vw" }}>
              <div
                className="confirmation-popup"
                style={{
                  padding: "30px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4 className=" text-center">Transfer Confirmation</h4>

                <div className="transfer-details">
                  <p style={{ fontSize: "18px", textAlign: "center" }}>
                    <strong>
                      You are transferring &#8377;{" "}
                      {roundAmount(formData.amount)} to:
                    </strong>
                  </p>

                  {verifiedMerchant && (
                    <div
                      className="merchant-details"
                      style={{
                        backgroundColor: "white",
                        padding: "25px",
                        borderRadius: "8px",
                        margin: "20px 0",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* <h5 className="mb-3">Beneficiary Details:</h5> */}
                      <div className="row">
                        <div className="col-md-6">
                          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                            <strong>Name:</strong> {verifiedMerchant.firstName}{" "}
                            {verifiedMerchant.lastName}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                            <strong>Business Name:</strong>{" "}
                            {verifiedMerchant.businessName}
                          </p>
                        </div>
                        <div className="col-12">
                          <p style={{ fontSize: "16px", marginBottom: "0" }}>
                            <strong>App ID:</strong> {formData.merchantAppId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-3 justify-content-center mt-4">
                  <button
                    className={styles.submit + " " + styles.active}
                    onClick={handleConfirmTransfer}
                    disabled={transferLoading}
                  >
                    {transferLoading ? "Processing..." : "Confirm Transfer"}
                  </button>
                  <button
                    className={styles.clear}
                    onClick={handleCancelTransfer}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      page="Internal Transfer"
      url="/dashboard/internal-transfer"
    >
      <div className="container">
        <div className="text-center">Loading...</div>
      </div>
    </DashboardLayout>
  );
};

export default InternalTransfer;
