import { useEffect, useState } from "react";
import FileUploader from "../../components/fileUploader/FileUploader";
import styles from "../../styles/login/Form.module.css";
import usePost from "../../hooks/usePost";
import { endpoints } from "../../services/apiEndpoints";
import { errorMessage, successMessage } from "../../utils/messges";
import styles2 from "../../styles/kycVerification/KycVerification.module.css";

export default function IndividualKycDetails({
  formData,
  handleChange,
  errors,
  panVerified,
  setPanVerified,
  aadhaarVerified,
  setAadhaarVerified,
}) {
  const {
    postData: verifyPan,
    loading: panLoading,
    data: panResponse,
    error: panError,
  } = usePost(endpoints.kyc.verifyPan, true);

  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");

  const {
    postData: sendAadhaarOtp,
    loading: aadhaarOtpLoading,
    data: aadhaarOtpResponse,
    error: aadhaarOtpError,
  } = usePost(endpoints.kyc.sendAadharOtp, true);

  const {
    postData: verifyAadhaarOtp,
    loading: aadhaarVerifyLoading,
    data: aadhaarVerifyResponse,
    error: aadhaarVerifyError,
  } = usePost(endpoints.kyc.verifyAadharOtp);

  const handleVerifyPan = async () => {
    if (!formData.panNumber || !formData.panFile) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("panNumber", formData.panNumber);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.panFile);
    formDataToSend.append("type", "P");

    await verifyPan(formDataToSend);
  };

  const handleSendAadhaarOtp = async () => {
    if (!formData.aadhaarNumber || !formData.aadharFile) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("aadhaarNumber", formData.aadhaarNumber);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.aadharFile);
    formDataToSend.append("type", "P");

    await sendAadhaarOtp(formDataToSend);
  };

  const handleVerifyAadhaarOtp = async () => {
    if (!aadhaarOtp || !formData.aadhaarNumber) {
      return;
    }
    const dataToSend = {
      aadhaarNumber: formData.aadhaarNumber,
      otp: aadhaarOtp,
      userId: formData.userId || "",
    };
    await verifyAadhaarOtp(dataToSend);
  };

  const handleOtpChange = (e) => {
    setAadhaarOtp(e.target.value);
  };

  // Handle PAN verification response
  useEffect(() => {
    if (panResponse && !panError && panResponse.statusCode < 400) {
      successMessage(panResponse.data || "PAN verified successfully.");
      setPanVerified(true);
    }
  }, [panResponse, panError, setPanVerified]);

  // Handle Aadhaar OTP send response
  useEffect(() => {
    if (
      aadhaarOtpResponse &&
      !aadhaarOtpError &&
      aadhaarOtpResponse.statusCode < 400
    ) {
      successMessage(aadhaarOtpResponse.data || "OTP sent successfully.");
      setAadhaarOtpSent(true);
    } else if( aadhaarOtpError || (aadhaarOtpResponse && aadhaarOtpResponse.statusCode >= 400)) {
      errorMessage(
        aadhaarOtpResponse?.data || "Failed to send OTP. Please try again."
      );
    }
  }, [aadhaarOtpResponse, aadhaarOtpError]);

  // Handle Aadhaar OTP verification response
  useEffect(() => {
    if (aadhaarVerifyResponse && !aadhaarVerifyError) {
      successMessage(
        aadhaarVerifyResponse.message || "Aadhaar verified successfully."
      );
      setAadhaarVerified(true);
      setAadhaarOtpSent(false);
      setAadhaarOtp("");
    }
  }, [aadhaarVerifyResponse, aadhaarVerifyError, setAadhaarVerified]);

  return (
    <div className="container-fluid">
      <div className="row g-3">
        {/* Email */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="form-group position-relative">
            <label htmlFor="email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              autoComplete="off"
              name="email"
              id="email"
              onChange={handleChange}
              value={formData.email}
              className={`${styles.input} form-control`}
            />
            {errors.email && (
              <small className="text-danger d-block mt-1">{errors.email}</small>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="form-group position-relative">
            <label htmlFor="phone" className="form-label">
              Phone <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              autoComplete="off"
              name="phone"
              id="phone"
              onChange={handleChange}
              value={formData.phone}
              className={`${styles.input} form-control`}
            />
            {errors.phone && (
              <small className="text-danger d-block mt-1">{errors.phone}</small>
            )}
          </div>
        </div>

        {/* PAN Number */}
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="form-group position-relative">
            <label htmlFor="panNumber" className="form-label">
              PAN Number <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter PAN number"
                autoComplete="off"
                name="panNumber"
                id="panNumber"
                onChange={handleChange}
                value={formData.panNumber}
                disabled={panVerified}
                className={`${styles.input} form-control flex-grow-1 ${
                  panVerified ? "bg-light" : ""
                }`}
              />
              <FileUploader
                name="panFile"
                onChange={handleChange}
                accept="application/pdf,image/*"
                disabled={panVerified}
              />
            </div>
            <div className="d-flex gap-2 align-items-center mb-2">
              <button
                type="button"
                className={styles2.button}
                onClick={handleVerifyPan}
                disabled={
                  panLoading ||
                  !formData.panNumber ||
                  !formData.panFile ||
                  panVerified
                }
              >
                {panLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verifying...
                  </>
                ) : panVerified ? (
                  <>
                    <i className="bi bi-check-circle me-1"></i>
                    Verified
                  </>
                ) : (
                  "Verify PAN"
                )}
              </button>
            </div>
            <small className="text-muted d-flex align-items-center">
              <i className="bi bi-info-circle me-1"></i>
              Upload a valid PAN card image or PDF file
            </small>
            {(errors.panNumber || errors.panFile) && (
              <small className="text-danger d-block mt-1">
                {errors.panNumber || errors.panFile}
              </small>
            )}
          </div>
        </div>

        {/* Aadhaar Number */}
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="form-group position-relative">
            <label htmlFor="aadhaarNumber" className="form-label">
              Aadhaar Number <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter Aadhaar number"
                autoComplete="off"
                name="aadhaarNumber"
                id="aadhaarNumber"
                onChange={handleChange}
                value={formData.aadhaarNumber}
                disabled={aadhaarVerified || aadhaarOtpSent}
                className={`${styles.input} form-control flex-grow-1 ${
                  aadhaarVerified ? "bg-light" : ""
                }`}
              />
              <FileUploader
                name="aadharFile"
                onChange={handleChange}
                accept="application/pdf,image/*"
                disabled={aadhaarVerified}
              />
            </div>

            {/* Show OTP input if OTP is sent but not verified */}
            {aadhaarOtpSent && !aadhaarVerified && (
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={aadhaarOtp}
                  onChange={handleOtpChange}
                  className={`${styles.input} form-control`}
                  maxLength="6"
                />
                <small className="text-muted">
                  Enter the 6-digit OTP sent to your registered mobile number
                </small>
              </div>
            )}

            <div className="d-flex gap-2 align-items-center mb-2">
              {!aadhaarOtpSent ? (
                <button
                  type="button"
                  className={styles2.button}
                  onClick={handleSendAadhaarOtp}
                  disabled={
                    aadhaarOtpLoading ||
                    !formData.aadhaarNumber ||
                    !formData.aadharFile ||
                    aadhaarVerified
                  }
                >
                  {aadhaarOtpLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              ) : !aadhaarVerified ? (
                <>
                  <button
                    type="button"
                    className="btn btn-success btn-sm px-4"
                    onClick={handleVerifyAadhaarOtp}
                    disabled={aadhaarVerifyLoading || !aadhaarOtp}
                  >
                    {aadhaarVerifyLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setAadhaarOtpSent(false);
                      setAadhaarOtp("");
                    }}
                    disabled={aadhaarVerifyLoading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-success btn-sm px-4"
                  disabled
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Verified
                </button>
              )}
            </div>

            <small className="text-muted d-flex align-items-center">
              <i className="bi bi-info-circle me-1"></i>
              Upload a valid Aadhaar card image or PDF file
            </small>
            {(errors.aadhaarNumber || errors.aadharFile) && (
              <small className="text-danger d-block mt-1">
                {errors.aadhaarNumber || errors.aadharFile}
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
