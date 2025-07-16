import { useEffect, useState } from "react";
import FileUploader from "../../components/fileUploader/FileUploader";
import usePost from "../../hooks/usePost";
import { endpoints } from "../../services/apiEndpoints";
import { successMessage } from "../../utils/messges";
import styles from "../../styles/kycVerification/KycVerification.module.css";

const titles = {
  sole_proprietorship: "Sole Proprietorship Registration Number",
  partnership: "Partnership Registration Number",
  llp: "LLP Registration Number",
  pvt_ltd: "Private Limited Company Registration Number",
  plc: "Public Limited Company Registration Number",
  llc: "LLC Registration Number",
  cooperative: "Cooperative Registration Number",
  corporation: "Corporation Registration Number",
  s_corp: "S Corporation Registration Number",
  non_profit: "Non-Profit Organization Registration Number",
  branch_office: "Branch Office Registration Number",
  joint_venture: "Joint Venture Registration Number",
  trust: "Trust Registration Number",
  franchise: "Franchise Registration Number",
  freelancer: "Freelancer/Independent Contractor ID",
};

export default function BusinessRegistration({
  formData,
  handleChange,
  errors,
  panVerified,
  setPanVerified,
  gstVerified,
  setGstVerified,
  cinVerified,
  setCinVerified,
}) {
  // PAN Verification Hook
  const {
    postData: verifyPan,
    loading: panLoading,
    data: panResponse,
    error: panError,
  } = usePost(endpoints.kyc.verifyPan, true);

  // GST Verification Hook
  const {
    postData: verifyGst,
    loading: gstLoading,
    data: gstResponse,
    error: gstError,
  } = usePost(endpoints.kyc.verifyGst, true);

  // CIN Verification Hook
  const {
    postData: verifyCin,
    loading: cinLoading,
    data: cinResponse,
    error: cinError,
  } = usePost(endpoints.kyc.verifyCin, true);

  const registrationTitle =
    titles[formData.companyType] || "Registration Number";

  // Handle PAN Verification
  const handleVerifyPan = async () => {
    if (!formData.companyPan || !formData.companyPanFile) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("panNumber", formData.companyPan);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.companyPanFile);
    formDataToSend.append("type", "B"); // 'B' for Business PAN

    await verifyPan(formDataToSend);
  };

  // Handle GST Verification
  const handleVerifyGst = async () => {
    if (!formData.gstNumber || !formData.gstFile) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("gstNumber", formData.gstNumber);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.gstFile);
    formDataToSend.append("type", "B");

    await verifyGst(formDataToSend);
  };

  // Handle CIN Verification
  const handleVerifyCin = async () => {
    if (!formData.registrationNumber || !formData.registrationFile) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("cinNumber", formData.registrationNumber);
    formDataToSend.append("userId", formData.userId || "");
    formDataToSend.append("img", formData.registrationFile);
    formDataToSend.append("type", "B");

    await verifyCin(formDataToSend);
  };

  // Handle PAN verification response
  useEffect(() => {
    if (panResponse && !panError) {
      successMessage(panResponse.data || "Company PAN verified successfully.");
      setPanVerified(true);
    }
  }, [panResponse, panError, setPanVerified]);

  // Handle GST verification response
  useEffect(() => {
    if (gstResponse && !gstError) {
      successMessage(gstResponse.data || "GST verified successfully.");
      setGstVerified(true);
    }
  }, [gstResponse, gstError, setGstVerified]);

  // Handle CIN verification response
  useEffect(() => {
    if (cinResponse && !cinError) {
      successMessage(cinResponse.data || "Registration number verified successfully.");
      setCinVerified(true);
    }
  }, [cinResponse, cinError, setCinVerified]);

  return (
    <div className="row mt-2">
      {/* Registration Number */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="registrationNumber">
          {registrationTitle} <span className="required">*</span>
        </label>
        <div className="d-flex gap-1 mb-2">
          <input
            type="text"
            placeholder="Enter registration number"
            autoComplete="off"
            name="registrationNumber"
            id="registrationNumber"
            onChange={handleChange}
            value={formData.registrationNumber}
            disabled={cinVerified}
            className={cinVerified ? "bg-light" : ""}
          />
          <FileUploader
            name="registrationFile"
            onChange={handleChange}
            accept={["application/pdf", "image/*"]}
            disabled={cinVerified}
          />
        </div>
        
        <div className="d-flex gap-2 align-items-center mb-2">
          <button
            type="button"
            className={styles.button}
            onClick={handleVerifyCin}
            disabled={
              cinLoading ||
              !formData.registrationNumber ||
              !formData.registrationFile ||
              cinVerified
            }
          >
            {cinLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Verifying...
              </>
            ) : cinVerified ? (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Verified
              </>
            ) : (
              "Verify Registration"
            )}
          </button>
        </div>

        <span className="info">
          <i className="bi bi-info-circle" aria-hidden="true"></i> Upload a
          valid registration document image or PDF file.
        </span>
        <br />
        {(errors.registrationNumber || errors.registrationFile) && (
          <span className="errors">
            {errors.registrationNumber || errors.registrationFile}
          </span>
        )}
      </div>

      {/* GST Number */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="gstNumber">
          GST Number <span className="required">*</span>
        </label>
        <div className="d-flex gap-1 mb-2">
          <input
            type="text"
            placeholder="Enter GST number"
            autoComplete="off"
            name="gstNumber"
            id="gstNumber"
            onChange={handleChange}
            value={formData.gstNumber}
            disabled={gstVerified}
            className={gstVerified ? "bg-light" : ""}
          />
          <FileUploader
            name="gstFile"
            onChange={handleChange}
            accept={["application/pdf", "image/*"]}
            disabled={gstVerified}
          />
        </div>
        
        <div className="d-flex gap-2 align-items-center mb-2">
          <button
            type="button"
            className={styles.button}
            onClick={handleVerifyGst}
            disabled={
              gstLoading ||
              !formData.gstNumber ||
              !formData.gstFile ||
              gstVerified
            }
          >
            {gstLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Verifying...
              </>
            ) : gstVerified ? (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Verified
              </>
            ) : (
              "Verify GST"
            )}
          </button>
        </div>

        <span className="info">
          <i className="bi bi-info-circle" aria-hidden="true"></i> Upload a
          valid GST certificate image or PDF file.
        </span>
        <br />
        {(errors.gstNumber || errors.gstFile) && (
          <span className="errors">{errors.gstNumber || errors.gstFile}</span>
        )}
      </div>

      {/* Company PAN */}
      <div className="col-md-4 col-sm-12 mb-3 position-relative">
        <label htmlFor="companyPan">
          Company PAN <span className="required">*</span>
        </label>
        <div className="d-flex gap-1 mb-2">
          <input
            type="text"
            placeholder="Enter company PAN"
            autoComplete="off"
            name="companyPan"
            id="companyPan"
            onChange={handleChange}
            value={formData.companyPan}
            disabled={panVerified}
            className={panVerified ? "bg-light" : ""}
          />
          <FileUploader
            name="companyPanFile"
            onChange={handleChange}
            accept={["application/pdf", "image/*"]}
            disabled={panVerified}
          />
        </div>
        
        <div className="d-flex gap-2 align-items-center mb-2">
          <button
            type="button"
            className={styles.button}
            onClick={handleVerifyPan}
            disabled={
              panLoading ||
              !formData.companyPan ||
              !formData.companyPanFile ||
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

        <span className="info">
          <i className="bi bi-info-circle" aria-hidden="true"></i> Upload a
          valid PAN card image or PDF file.
        </span>
        <br />
        {(errors.companyPan || errors.companyPanFile) && (
          <span className="errors">
            {errors.companyPan || errors.companyPanFile}
          </span>
        )}
      </div>
    </div>
  );
}