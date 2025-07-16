import { useEffect, useState } from "react";
import FileUploader from "../../components/fileUploader/FileUploader";
import usePost from "../../hooks/usePost";
import { endpoints } from "../../services/apiEndpoints";
import { successMessage } from "../../utils/messges";
import styles from "../../styles/kycVerification/KycVerification.module.css";

export default function AuthorisedSignatory({
  formData,
  handleChange,
  handleStepChange,
  errors,
  directorPanVerified,
  setDirectorPanVerified,
  directorAadhaarVerified,
  setDirectorAadhaarVerified,
}) {
  // Director PAN Verification Hook
  const {
    postData: verifyDirectorPan,
    loading: directorPanLoading,
    data: directorPanResponse,
    error: directorPanError,
  } = usePost(endpoints.kyc.verifyPan, true);

  // Director Aadhaar OTP States
  const [directorAadhaarOtpSent, setDirectorAadhaarOtpSent] = useState(false);
  const [directorAadhaarOtp, setDirectorAadhaarOtp] = useState("");

  // Director Aadhaar OTP Send Hook
  const {
    postData: sendDirectorAadhaarOtp,
    loading: directorAadhaarOtpLoading,
    data: directorAadhaarOtpResponse,
    error: directorAadhaarOtpError,
  } = usePost(endpoints.kyc.sendAadharOtp, true);

  // Director Aadhaar OTP Verify Hook
  const {
    postData: verifyDirectorAadhaarOtp,
    loading: directorAadhaarVerifyLoading,
    data: directorAadhaarVerifyResponse,
    error: directorAadhaarVerifyError,
  } = usePost(endpoints.kyc.verifyAadharOtp);

  // Handle Director PAN Verification
  const handleVerifyDirectorPan = async () => {
    if (!formData.directorPanNumber || !formData.directorPanFile) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("panNumber", formData.directorPanNumber);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.directorPanFile);
    formDataToSend.append("type", "D");

    await verifyDirectorPan(formDataToSend);
  };

  // Handle Director Aadhaar OTP Send
  const handleSendDirectorAadhaarOtp = async () => {
    if (!formData.aadhaarNumber || !formData.aadhaarFile) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("aadhaarNumber", formData.aadhaarNumber);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.aadhaarFile);
    formDataToSend.append("type", "D");

    await sendDirectorAadhaarOtp(formDataToSend);
  };

  // Handle Director Aadhaar OTP Verification
  const handleVerifyDirectorAadhaarOtp = async () => {
    if (!directorAadhaarOtp || !formData.aadhaarNumber) {
      return;
    }
    const dataToSend = {
      aadhaarNumber: formData.aadhaarNumber,
      otp: directorAadhaarOtp,
      userId: formData.userId || "",
    };
    await verifyDirectorAadhaarOtp(dataToSend);
  };

  // Handle Director Aadhaar OTP Change
  const handleDirectorOtpChange = (e) => {
    setDirectorAadhaarOtp(e.target.value);
  };

  // Handle Director PAN verification response
  useEffect(() => {
    if (directorPanResponse && !directorPanError) {
      successMessage(
        directorPanResponse.message || "Director PAN verified successfully."
      );
      setDirectorPanVerified(true);
    }
  }, [directorPanResponse, directorPanError, setDirectorPanVerified]);

  // Handle Director Aadhaar OTP send response
  useEffect(() => {
    if (directorAadhaarOtpResponse && !directorAadhaarOtpError) {
      successMessage(
        directorAadhaarOtpResponse.message || "OTP sent successfully."
      );
      setDirectorAadhaarOtpSent(true);
    }
  }, [directorAadhaarOtpResponse, directorAadhaarOtpError]);

  // Handle Director Aadhaar OTP verification response
  useEffect(() => {
    if (directorAadhaarVerifyResponse && !directorAadhaarVerifyError) {
      successMessage(
        directorAadhaarVerifyResponse.message ||
          "Director Aadhaar verified successfully."
      );
      setDirectorAadhaarVerified(true);
      setDirectorAadhaarOtpSent(false);
      setDirectorAadhaarOtp("");
    }
  }, [
    directorAadhaarVerifyResponse,
    directorAadhaarVerifyError,
    setDirectorAadhaarVerified,
  ]);

  return (
    <div className="row mt-2">
      {/* List of Directors */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="listOfDirectors">
          List of Directors <span className="required">*</span>
        </label>
        <input
          type="file"
          name="listOfDirectors"
          id="listOfDirectors"
          onChange={handleChange}
        />
        {errors.listOfDirectors && (
          <span className="errors">{errors.listOfDirectors}</span>
        )}
      </div>

      {/* Director Name */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="directorName">
          Director Name <span className="required">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter director name"
          autoComplete="off"
          name="directorName"
          id="directorName"
          onChange={handleChange}
          value={formData.directorName}
        />
        {errors.directorName && (
          <span className="errors">{errors.directorName}</span>
        )}
      </div>

      {/* Address Proof */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="addressProof">
          Address Proof <span className="required">*</span>
        </label>
        <input
          type="file"
          name="addressProof"
          id="addressProof"
          onChange={handleChange}
        />
        {errors.addressProof && (
          <span className="errors">{errors.addressProof}</span>
        )}
      </div>

      {/* Director PAN Number */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="directorPanNumber">
          Director PAN Number <span className="required">*</span>
        </label>
        <div className="d-flex gap-1 mb-2">
          <input
            type="text"
            placeholder="Enter director PAN number"
            autoComplete="off"
            name="directorPanNumber"
            id="directorPanNumber"
            onChange={handleChange}
            value={formData.directorPanNumber}
            disabled={directorPanVerified}
            className={directorPanVerified ? "bg-light" : ""}
          />
          <FileUploader
            name="directorPanFile"
            onChange={handleChange}
            accept={["application/pdf", "image/*"]}
            disabled={directorPanVerified}
          />
        </div>

        <div className="d-flex gap-2 align-items-center mb-2">
          <button
            type="button"
                            className={styles.button}
            
            onClick={handleVerifyDirectorPan}
            disabled={
              directorPanLoading ||
              !formData.directorPanNumber ||
              !formData.directorPanFile ||
              directorPanVerified
            }
          >
            {directorPanLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Verifying...
              </>
            ) : directorPanVerified ? (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Verified
              </>
            ) : (
              "Verify PAN"
            )}
          </button>
        </div>

        <span className="info">
          <i className="bi bi-info-circle" aria-hidden="true"></i> Upload a
          valid PAN card image or PDF file.
        </span>
        <br />
        {(errors.directorPanNumber || errors.directorPanFile) && (
          <span className="errors">
            {errors.directorPanNumber || errors.directorPanFile}
          </span>
        )}
      </div>

      {/* Director Aadhaar Number */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="aadhaarNumber">
          Aadhar Number <span className="required">*</span>
        </label>
        <div className="d-flex gap-1 mb-2">
          <input
            type="text"
            placeholder="Enter Aadhar number"
            autoComplete="off"
            name="aadhaarNumber"
            id="aadhaarNumber"
            onChange={handleChange}
            value={formData.aadhaarNumber}
            disabled={directorAadhaarVerified || directorAadhaarOtpSent}
            className={directorAadhaarVerified ? "bg-light" : ""}
          />
          <FileUploader
            name="aadhaarFile"
            onChange={handleChange}
            accept={["application/pdf", "image/*"]}
            disabled={directorAadhaarVerified}
          />
        </div>

        {/* Show OTP input if OTP is sent but not verified */}
        {directorAadhaarOtpSent && !directorAadhaarVerified && (
          <div className="mb-2">
            <input
              type="text"
              placeholder="Enter OTP"
              value={directorAadhaarOtp}
              onChange={handleDirectorOtpChange}
              className="form-control"
              maxLength="6"
            />
            <small className="text-muted">
              Enter the 6-digit OTP sent to your registered mobile number
            </small>
          </div>
        )}

        <div className="d-flex gap-2 align-items-center mb-2">
          {!directorAadhaarOtpSent ? (
            <button
              type="button"
              className={styles.button}
              onClick={handleSendDirectorAadhaarOtp}
              disabled={
                directorAadhaarOtpLoading ||
                !formData.aadhaarNumber ||
                !formData.aadhaarFile ||
                directorAadhaarVerified
              }
            >
              {directorAadhaarOtpLoading ? (
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
          ) : !directorAadhaarVerified ? (
            <>
              <button
                type="button"
                className="btn btn-success btn-sm px-4"
                onClick={handleVerifyDirectorAadhaarOtp}
                disabled={directorAadhaarVerifyLoading || !directorAadhaarOtp}
              >
                {directorAadhaarVerifyLoading ? (
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
                  setDirectorAadhaarOtpSent(false);
                  setDirectorAadhaarOtp("");
                }}
                disabled={directorAadhaarVerifyLoading}
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

        <span className="info">
          <i className="bi bi-info-circle" aria-hidden="true"></i> Upload a
          valid Aadhar card image or PDF file.
        </span>
        <br />
        {(errors.aadhaarNumber || errors.aadhaarFile) && (
          <span className="errors">
            {errors.aadhaarNumber || errors.aadhaarFile}
          </span>
        )}
      </div>
    </div>
  );
}
