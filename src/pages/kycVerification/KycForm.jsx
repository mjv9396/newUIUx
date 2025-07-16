import { useEffect, useState } from "react";
import BusinessDetails from "./BusinessDetails";
import BusinessRegistration from "./BusinessRegistration";
import AuthorisedSignatory from "./AuthorisedSignatory";
import BankDetails from "./BankDetails";
import UploadDocuments from "./UploadDocuments";
import styles from "../../styles/kycVerification/KycVerification.module.css";

import IndividualKycDetails from "./IndividualKycDetails";
import useKyc from "../../hooks/useKyc";
import useFetch from "../../hooks/useFetch";
import { endpoints } from "../../services/apiEndpoints";
import { GetUserId } from "../../services/cookieStore";

export default function KycForm() {
  const {
    errors,
    setErrors,
    formData,
    setFormData,
    activeStep,
    setActiveStep,
    aadhaarVerified,
    setAadhaarVerified,
    panVerified,
    setPanVerified,
    gstVerified,
    setGstVerified,
    cinVerified,
    setCinVerified,
    bussinessPanVerified,
    setBussinessPanVerified,
    directorPanVerified,
    setDirectorPanVerified,
    directorAadhaarVerified,
    setDirectorAadhaarVerified,
    handleChange,
    handleStepChange,
    handleSubmit,
  } = useKyc();

  const {
    data: kycData,
    loading: kycLoading,
    error: kycError,
    fetchData: fetchKycData,
  } = useFetch();

  useEffect(() => {
    // Fetch existing KYC data if available
    fetchKycData(endpoints.kyc.getAllDocument + GetUserId());
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <>
        <div className={styles.header}>
          <span className={styles.badge}>&#10004;</span>
          <h6>Email Verification</h6>
        </div>
        <div className={styles.content}></div>
      </>

      <>
        <div className={styles.header}>
          <span className={styles.badge}>&#10004;</span>
          <h6>Phone Verification</h6>
        </div>
        <div className={styles.content}></div>
      </>

      {/* KYC Type */}
      <>
        <div className={styles.header}>
          <span
            onClick={() => handleStepChange(2)}
            className={`${styles.badge} ${
              activeStep >= 2 ? styles.active : ""
            }`}
          >
            3
          </span>
          <h6>KYC Type</h6>
        </div>

        <div className={styles.content}>
          {activeStep === 2 && (
            <>
              <div className="col-md-4 col-sm-12 mb-3 position-relative">
                <div className={styles.kycType}>
                  <div className={styles.kycTypeItem}>
                    <input
                      type="radio"
                      name="kycType"
                      value="individual"
                      checked={formData.kycType === "individual"}
                      onChange={handleChange}
                      required
                    />
                    Individual
                  </div>
                  <div className={styles.kycTypeItem}>
                    <input
                      type="radio"
                      name="kycType"
                      value="business"
                      checked={formData.kycType === "business"}
                      onChange={handleChange}
                      required
                    />
                    Business
                  </div>
                </div>
                {errors.kycType && (
                  <span className="errors">{errors.kycType}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleStepChange(3)}
                className={styles.button}
                disabled={!formData.kycType}
              >
                Next
              </button>
            </>
          )}
        </div>
      </>

      {/* Individual KYC Details */}
      {formData.kycType === "individual" && (
        <>
          <div className={styles.header}>
            <span
              onClick={() => handleStepChange(3)}
              className={`${styles.badge} ${
                activeStep >= 3 ? styles.active : ""
              }`}
            >
              4
            </span>
            <h6>Individual Details</h6>
          </div>

          <div className={styles.content}>
            {activeStep === 3 && (
              <>
                <div className={styles.form}>
                  <IndividualKycDetails
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    panVerified={panVerified}
                    setPanVerified={setPanVerified}
                    aadhaarVerified={aadhaarVerified}
                    setAadhaarVerified={setAadhaarVerified}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => handleStepChange(2)}
                    className={`${styles.button} btn-outline-secondary`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!aadhaarVerified || !panVerified}
                    className={`${styles.button} ${
                      !aadhaarVerified || !panVerified ? "disabled" : ""
                    }`}
                    title={
                      !aadhaarVerified || !panVerified
                        ? "Please verify both Aadhaar and PAN before submitting"
                        : ""
                    }
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Business KYC Flow */}
      {formData.kycType === "business" && (
        <>
          {/* Business Details */}
          <div>
            <div className={styles.header}>
              <span
                onClick={() => handleStepChange(3)}
                className={`${styles.badge} ${
                  activeStep >= 3 ? styles.active : ""
                }`}
              >
                4
              </span>
              <h6>Business Details</h6>
            </div>

            <div className={styles.content}>
              {activeStep === 3 && (
                <>
                  <div className={styles.form}>
                    <BusinessDetails
                      formData={formData}
                      handleChange={handleChange}
                      errors={errors}
                    />
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className={`${styles.button} btn-outline-secondary`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(4)}
                      className={styles.button}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Business Registration Details */}
          <div>
            <div className={styles.header}>
              <span
                onClick={() => handleStepChange(4)}
                className={`${styles.badge} ${
                  activeStep >= 4 ? styles.active : ""
                }`}
              >
                5
              </span>
              <h6>Business Registration Details</h6>
            </div>

            <div className={styles.content}>
              {activeStep === 4 && (
                <>
                  <div className={styles.form}>
                    <BusinessRegistration
                      formData={formData}
                      handleChange={handleChange}
                      errors={errors}
                      gstVerified={gstVerified}
                      setGstVerified={setGstVerified}
                      cinVerified={cinVerified}
                      setCinVerified={setCinVerified}
                      panVerified={bussinessPanVerified}
                      setPanVerified={setBussinessPanVerified}
                    />
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(3)}
                      className={`${styles.button} btn-outline-secondary`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(5)}
                      className={styles.button}
                      disabled={
                        !bussinessPanVerified || !gstVerified || !cinVerified
                      }
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Authorised Signatory Details */}
          <div>
            <div className={styles.header}>
              <span
                onClick={() => handleStepChange(5)}
                className={`${styles.badge} ${
                  activeStep >= 5 ? styles.active : ""
                }`}
              >
                6
              </span>
              <h6>Authorised Signatory Details</h6>
            </div>

            <div className={styles.content}>
              {activeStep === 5 && (
                <>
                  <div className={styles.form}>
                    <AuthorisedSignatory
                      formData={formData}
                      handleChange={handleChange}
                      errors={errors}
                      directorAadhaarVerified={directorAadhaarVerified}
                      setDirectorAadhaarVerified={setDirectorAadhaarVerified}
                      directorPanVerified={directorPanVerified}
                      setDirectorPanVerified={setDirectorPanVerified}
                    />
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(4)}
                      className={`${styles.button} btn-outline-secondary`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(6)}
                      className={styles.button}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <div className={styles.header}>
              <span
                onClick={() => handleStepChange(6)}
                className={`${styles.badge} ${
                  activeStep >= 6 ? styles.active : ""
                }`}
              >
                7
              </span>
              <h6>Bank Account Details</h6>
            </div>

            <div className={styles.content}>
              {activeStep === 6 && (
                <>
                  <div className={styles.form}>
                    <BankDetails
                      formData={formData}
                      handleChange={handleChange}
                      errors={errors}
                    />
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(5)}
                      className={`${styles.button} btn-outline-secondary`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepChange(7)}
                      className={styles.button}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upload Documents */}
          <div>
            <div className={styles.header}>
              <span
                onClick={() => handleStepChange(7)}
                className={`${styles.badge} ${
                  activeStep >= 7 ? styles.active : ""
                }`}
              >
                8
              </span>
              <h6>Upload Business Documents</h6>
            </div>

            <div className={styles.content}>
              {activeStep === 7 && (
                <>
                  <div className={styles.form}>
                    <UploadDocuments
                      formData={formData}
                      handleChange={handleChange}
                      errors={errors}
                    />
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleStepChange(6)}
                      className={`${styles.button} btn-outline-secondary`}
                    >
                      Back
                    </button>
                    <button type="submit" className={styles.button}>
                      Submit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Done */}
      <div>
        <div className={styles.header}>
          <span className={styles.badge}>
            {formData.kycType === "individual" ? (
              5
            ) : formData.kycType === "business" ? (
              9
            ) : (
              <>&#33;</>
            )}
          </span>
          <h6>Done</h6>
        </div>

        {(activeStep === 4 && formData.kycType === "individual") ||
        (activeStep === 8 && formData.kycType === "business") ? (
          <div className={styles.content}>
            <div className={styles.form}>
              <div className="text-center py-4">
                <div className="mb-3">
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
                <h3 className="text-success">
                  Thank you for submitting your KYC details!
                </h3>
                <p className="text-muted">
                  Your application is under review. We will notify you via email
                  once the verification is complete.
                </p>
                <div className="mt-4">
                  <small className="text-muted">
                    Reference ID: KYC-{Date.now()}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
