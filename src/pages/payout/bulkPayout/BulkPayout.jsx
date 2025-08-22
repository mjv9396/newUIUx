import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "../../../styles/common/List.module.css";
import SimpleFileUploader from "./components/SimpleFileUploader";
import BeneficiaryList from "./components/BeneficiaryList";
import {
  downloadTemplate,
  downloadJSONTemplate,
} from "../../../utils/bulkPayoutTemplate";
import stylesButton from "../../../styles/common/Add.module.css";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { errorMessage, successMessage } from "../../../utils/messges";

const BulkPayout = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferStatus, setTransferStatus] = useState(null);
  const [validationErrors, setValidationErrors] = useState(null);
  const [transferMode, setTransferMode] = useState("");

  // Handle file upload
  const handleFileUpload = (result) => {
    if (result.success) {
      setUploadedData(result);
      setBeneficiaries(result.data);
      setTransferStatus(null);

      // Handle validation results
      if (result.validation && !result.validation.isValid) {
        setValidationErrors(result.validation.errors);
      } else {
        setValidationErrors(null);
      }
    }
  };

  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.payout.sendBulkMoney
  );

  useEffect(() => {
    if (data && !loading) {

      if (data.statusCode < 400) {
        successMessage(
          "Bulk transfer initiated successfully for all beneficiaries."
        );
        setTransferStatus({
          type: "success",
          message:
            "Bulk transfer initiated successfully for all beneficiaries.",
        });
      } else if (data.statusCode >= 400) {
        errorMessage(
          typeof data?.data === "string"
            ? data?.data
            : "Failed to initiate bulk transfer. Please try again."
        );

        setTransferStatus({
          type: "error",
          message: "Failed to initiate bulk transfer. Please try again.",
          error:
            typeof data?.data === "string"
              ? data?.data
              : "An error occurred while processing the request.",
        });
      }
    }
  }, [data, error]);

  // Handle transfer
  const handleTransfer = async (selectedBeneficiaries) => {
    setIsTransferring(true);
    setTransferStatus({
      type: "loading",
      message: "Processing bulk transfer...",
    });

    try {
      const formData = {
        transferMode: transferMode,
        transferData: selectedBeneficiaries,
      };

      await postData(formData);

      // Here you would make the actual API call:
      // const response = await bulkTransferAPI(selectedBeneficiaries);
    } catch (error) {
      setTransferStatus({
        type: "error",
        message: "Failed to process bulk transfer. Please try again.",
        error: typeof data === "string" ? data : error?.detailMessage,
      });
    } finally {
      setIsTransferring(false);
    }
  };

  // Reset upload
  const handleReset = () => {
    setUploadedData(null);
    setBeneficiaries([]);
    setTransferStatus(null);
    setValidationErrors(null);
  };

  return (
    <DashboardLayout page="Bulk Payout" url="/dashboard/bulkpayout">
      {/* Template Download Row */}
      <div className="row mt-2">
        <div className="col-12">
          <div className="d-flex justify-content-between gap-2">
            {/* select transfer mode dropdown  */}
            <div className="form-group">
              {/* <label htmlFor="transferMode" className="form-label">
                Transfer Mode
              </label> */}
              <select
                id="transferMode"
                className="form-select"
                value={transferMode}
                onChange={(e) => setTransferMode(e.target.value)}
              >
                <option value="" disabled>
                  --Select Transfer Mode--
                </option>
                <option value="IMPS">IMPS</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                {/* <option value="scheduled">IFT</option> */}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={stylesButton.refreshBtn}
                onClick={() => {
                  const result = downloadTemplate();
                  if (result.success) {
                    console.log("CSV Template downloaded successfully");
                  }
                }}
                disabled={isLoading}
              >
                <i className="bi bi-download me-2"></i>
                CSV Template
              </button>
              <button
                type="button"
                className={stylesButton.refreshBtn}
                onClick={() => {
                  const result = downloadJSONTemplate();
                  if (result.success) {
                    console.log("JSON Template downloaded successfully");
                  }
                }}
                disabled={isLoading}
              >
                <i className="bi bi-download me-2"></i>
                JSON Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Main Content Section */}
        <div className="col-md-12 mb-3">
          <div className={styles.listing}>
            {/* Header Row with Beneficiaries and Upload */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  Beneficiaries{" "}
                  {beneficiaries.length > 0 && `(${beneficiaries.length})`}
                </h5>
                {uploadedData && (
                  <small className="text-muted">
                    File: {uploadedData.fileName} | Records:{" "}
                    {beneficiaries.length} | Size:{" "}
                    {(uploadedData.fileSize / 1024).toFixed(2)} KB
                  </small>
                )}
              </div>

              <div className="d-flex gap-2 align-items-center">
                {/* Upload Section */}
                <SimpleFileUploader
                  onFileUpload={handleFileUpload}
                  isLoading={isLoading}
                />

                {/* Upload New File Button */}
                {/* {uploadedData && (
                  <button
                    className={styles.refreshBtn}
                    onClick={handleReset}
                    disabled={isTransferring}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Upload New File
                  </button>
                )} */}
              </div>
            </div>

            {/* Beneficiaries Table - Full Width */}
            {beneficiaries.length > 0 ? (
              <BeneficiaryList
                beneficiaries={beneficiaries}
                onTransfer={handleTransfer}
                isTransferring={isTransferring}
                validationErrors={validationErrors}
                transferMode={transferMode}
              />
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-inbox fa-3x text-muted mb-3"></i>
                <h6 className="text-muted">No beneficiaries uploaded yet</h6>
                <p className="text-muted">
                  Upload a file to see beneficiaries here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BulkPayout;
