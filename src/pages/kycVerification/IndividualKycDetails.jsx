import { useEffect, useState } from "react";
import FileUploader from "../../components/fileUploader/FileUploader";
import styles from "../../styles/login/Form.module.css";
import usePost from "../../hooks/usePost";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { errorMessage, successMessage } from "../../utils/messges";
import styles2 from "../../styles/kycVerification/KycVerification.module.css";
import { GetUserId } from "../../services/cookieStore";

export default function IndividualKycDetails({
  formData,
  handleChange,
  errors,
  panVerified,
  setPanVerified,
  aadhaarVerified,
  setAadhaarVerified,
  kycData,
}) {
  const {
    postData: verifyPan,
    loading: panLoading,
    data: panResponse,
    error: panError,
  } = usePost(endpoints.kyc.verifyPan, true);

  const [digilockerRequestId, setDigilockerRequestId] = useState("");
  const [digilockerInitialized, setDigilockerInitialized] = useState(false);

  const {
    postData: initializeDigilocker,
    loading: digilockerInitLoading,
    data: digilockerInitResponse,
    error: digilockerInitError,
  } = usePost(endpoints.kyc.initializeDigilocker, true);

  const {
    postData: verifyAadhaarDigilocker,
    loading: digilockerVerifyLoading,
    data: digilockerVerifyResponse,
    error: digilockerVerifyError,
  } = usePost(endpoints.kyc.verifyAadhaarDigilocker, true);

  // Fetch user profile data
  const {
    data: userProfileData,
    loading: userProfileLoading,
    error: userProfileError,
    fetchData: fetchUserProfile,
  } = useFetch();

  const handleVerifyPan = async () => {
    if (!formData.panNumber || !formData.panFile) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("panNumber", formData.panNumber);
    formDataToSend.append("userId", GetUserId() || "");
    formDataToSend.append("img", formData.panFile);
    formDataToSend.append("type", "P");

    await verifyPan(formDataToSend);
  };

  const handleInitializeDigilocker = async () => {
    if (!formData.aadhaarNumber || !formData.aadharFile) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("aadhaarNumber", formData.aadhaarNumber);
    formDataToSend.append("userId", GetUserId() || "");
    formDataToSend.append("img", formData.aadharFile);
    formDataToSend.append("type", "P");

    await initializeDigilocker(formDataToSend);
  };

  const handleVerifyAadhaarDigilocker = async () => {
    if (!digilockerRequestId) {
      errorMessage("Please initialize DigiLocker authentication first.");
      return;
    }
    const dataToSend = {
      requestId: digilockerRequestId,
      userId: GetUserId() || "",
    };
    await verifyAadhaarDigilocker(dataToSend);
  };

  // Handle PAN verification response
  useEffect(() => {
    if (panResponse && !panError && panResponse.statusCode < 400) {
      successMessage(panResponse.data || "PAN verified successfully.");
      setPanVerified(true);
    }
  }, [panResponse, panError, setPanVerified]);

  // Handle DigiLocker initialization response
  useEffect(() => {
    if (
      digilockerInitResponse &&
      !digilockerInitError &&
      digilockerInitResponse.statusCode < 400
    ) {
      const { authUrl, requestId } = digilockerInitResponse.data.result;
      setDigilockerRequestId(requestId);
      setDigilockerInitialized(true);
      successMessage(
        digilockerInitResponse.data.message ||
          "DigiLocker auth URL generated successfully."
      );

      // Open the auth URL in a new tab
      window.open(authUrl, "_blank");
    } else if (
      digilockerInitError ||
      (digilockerInitResponse && digilockerInitResponse.statusCode >= 400)
    ) {
      errorMessage(
        digilockerInitResponse?.data ||
          "Failed to initialize DigiLocker. Please try again."
      );
    }
  }, [digilockerInitResponse, digilockerInitError]);

  // Handle DigiLocker verification response
  useEffect(() => {
    if (digilockerVerifyResponse?.statusCode >= 400 || digilockerVerifyError) {
      errorMessage(
        digilockerVerifyResponse?.data ||
          "Failed to verify Aadhaar via DigiLocker. Please try again."
      );
    }
    if (
      digilockerVerifyResponse &&
      !digilockerVerifyError &&
      digilockerVerifyResponse?.statusCode < 400
    ) {
      successMessage(
        digilockerVerifyResponse.data ||
          "Aadhaar verified successfully via DigiLocker."
      );
      setAadhaarVerified(true);
      setDigilockerInitialized(false);
      setDigilockerRequestId("");
    }
  }, [digilockerVerifyResponse, digilockerVerifyError, setAadhaarVerified]);

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile(endpoints.user.fullProfile);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get user profile information
  const getUserEmail = () => {
    if (userProfileLoading) return "Loading...";
    return userProfileData?.data?.email || formData.email || "";
  };

  const getUserPhone = () => {
    if (userProfileLoading) return "Loading...";
    return userProfileData?.data?.phoneNumber || formData.phone || "";
  };

  // Get document information from kycData
  const getDocumentInfo = (documentType) => {
    if (kycData && kycData.data && Array.isArray(kycData.data)) {
      return kycData.data.find((doc) => doc.documentType === documentType);
    }
    return null;
  };

  const aadhaarDoc = getDocumentInfo("AADHAAR_CARD");
  const panDoc = getDocumentInfo("PAN_CARD");

  // Helper function to determine document status
  const getDocumentStatus = (doc) => {
    if (!doc) return "none";
    if (doc.verified) return "verified";
    if (doc.rejectedReasion && doc.rejectedReasion.trim() !== "")
      return "rejected";
    return "pending";
  };

  const panStatus = getDocumentStatus(panDoc);
  const aadhaarStatus = getDocumentStatus(aadhaarDoc);

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
              value={getUserEmail()}
              disabled={true}
              className={`${styles.input} form-control bg-light`}
            />
            <small className="text-muted d-flex align-items-center mt-1">
              <i className="bi bi-check-circle-fill text-success me-1"></i>
              Email verified during registration
            </small>
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
              value={getUserPhone()}
              disabled={true}
              className={`${styles.input} form-control bg-light`}
            />
            <small className="text-muted d-flex align-items-center mt-1">
              <i className="bi bi-check-circle-fill text-success me-1"></i>
              Phone verified during registration
            </small>
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
                disabled={panStatus === "verified" || panStatus === "pending" || panVerified}
                className={`${styles.input} form-control flex-grow-1 ${
                  panStatus === "verified" || panStatus === "pending"
                    ? "bg-light"
                    : ""
                }`}
              />
              <FileUploader
                name="panFile"
                onChange={handleChange}
                accept="image/*"
                disabled={panStatus === "verified" || panStatus === "pending" || panVerified}
              />
            </div>
            {/* Show document status information */}
            {panDoc && (
              <div
                className={`alert ${
                  panStatus === "verified"
                    ? "alert-success"
                    : panStatus === "rejected"
                    ? "alert-danger"
                    : "alert-warning"
                } py-2 px-3 mb-2`}
              >
                <small>
                  <i
                    className={`bi ${
                      panStatus === "verified"
                        ? "bi-check-circle"
                        : panStatus === "rejected"
                        ? "bi-x-circle"
                        : "bi-clock"
                    } me-1`}
                  ></i>
                  Document uploaded on {panDoc.createdDate} -
                  <strong className="ms-1">
                    {panStatus === "verified"
                      ? "Verified"
                      : panStatus === "rejected"
                      ? "Rejected"
                      : "Pending Verification"}
                  </strong>
                  {panDoc.documentName && (
                    <span className="ms-1">({panDoc.documentName})</span>
                  )}
                  {panStatus === "rejected" && panDoc.rejectedReasion && (
                    <div className="mt-1">
                      <strong>Reason:</strong> {panDoc.rejectedReasion}
                    </div>
                  )}
                </small>
              </div>
            )}
            <div className="d-flex gap-2 align-items-center mb-2">
              <button
                type="button"
                className={styles2.button}
                onClick={handleVerifyPan}
                disabled={
                  panLoading ||
                  !formData.panNumber ||
                  !formData.panFile ||
                  panStatus === "verified" ||
                  panStatus === "pending" || panVerified
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
                ) : panStatus === "verified" ? (
                  <>
                    <i className="bi bi-check-circle me-1"></i>
                    Verified
                  </>
                ) : panStatus === "pending" ? (
                  <>
                    <i className="bi bi-clock me-1"></i>
                    Pending Verification
                  </>
                ) : (
                  panVerified ? "Verified" : "Verify PAN"
                )}
              </button>
            </div>
            <small className="text-muted d-flex align-items-center">
              <i className="bi bi-info-circle me-1"></i>
              Upload a valid PAN card image
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
                disabled={
                  aadhaarStatus === "verified" || aadhaarStatus === "pending"
                }
                className={`${styles.input} form-control flex-grow-1 ${
                  aadhaarStatus === "verified" || aadhaarStatus === "pending"
                    ? "bg-light"
                    : ""
                }`}
              />
              <FileUploader
                name="aadharFile"
                onChange={handleChange}
                accept="image/*"
                disabled={
                  aadhaarStatus === "verified" || aadhaarStatus === "pending"
                }
              />
            </div>

            {/* Show document status information */}
            {aadhaarDoc && (
              <div
                className={`alert ${
                  aadhaarStatus === "verified"
                    ? "alert-success"
                    : aadhaarStatus === "rejected"
                    ? "alert-danger"
                    : "alert-warning"
                } py-2 px-3 mb-2`}
              >
                <small>
                  <i
                    className={`bi ${
                      aadhaarStatus === "verified"
                        ? "bi-check-circle"
                        : aadhaarStatus === "rejected"
                        ? "bi-x-circle"
                        : "bi-clock"
                    } me-1`}
                  ></i>
                  Document uploaded on {aadhaarDoc.createdDate} -
                  <strong className="ms-1">
                    {aadhaarStatus === "verified"
                      ? "Verified"
                      : aadhaarStatus === "rejected"
                      ? "Rejected"
                      : "Pending Verification"}
                  </strong>
                  {aadhaarDoc.documentName && (
                    <span className="ms-1">({aadhaarDoc.documentName})</span>
                  )}
                  {aadhaarStatus === "rejected" &&
                    aadhaarDoc.rejectedReasion && (
                      <div className="mt-1">
                        <strong>Reason:</strong> {aadhaarDoc.rejectedReasion}
                      </div>
                    )}
                </small>
              </div>
            )}

            <div className="d-flex gap-2 align-items-center mb-2 flex-wrap">
              {aadhaarStatus !== "verified" && aadhaarStatus !== "pending" && (
                <>
                  {/* DigiLocker Initialize Button */}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleInitializeDigilocker}
                    disabled={
                      digilockerInitLoading ||
                      !formData.aadhaarNumber ||
                      !formData.aadharFile
                    }
                  >
                    {digilockerInitLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Initializing...
                      </>
                    ) : (
                      "Initialize DigiLocker"
                    )}
                  </button>

                  {/* DigiLocker Verify Button */}
                  {digilockerInitialized && (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={handleVerifyAadhaarDigilocker}
                      disabled={digilockerVerifyLoading || !digilockerRequestId}
                    >
                      {digilockerVerifyLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Verifying...
                        </>
                      ) : (
                        "Verify via DigiLocker"
                      )}
                    </button>
                  )}
                </>
              )}

              {/* Show status for verified/pending documents */}
              {aadhaarStatus === "verified" && (
                <button
                  type="button"
                  className="btn btn-success btn-sm px-4"
                  disabled
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Verified
                </button>
              )}

              {aadhaarStatus === "pending" && (
                <button
                  type="button"
                  className="btn btn-warning btn-sm px-4"
                  disabled
                >
                  <i className="bi bi-clock me-1"></i>
                  Pending Verification
                </button>
              )}
            </div>

            <small className="text-muted d-flex align-items-center">
              <i className="bi bi-info-circle me-1"></i>
              Upload a valid Aadhaar card image. Verify using
              DigiLocker for secure authentication.
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
