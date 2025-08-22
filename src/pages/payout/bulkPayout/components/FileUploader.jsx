import { useState, useRef } from "react";
import styles from "../../../../styles/common/Add.module.css";
import {
  downloadTemplate,
  downloadJSONTemplate,
} from "../../../../utils/bulkPayoutTemplate";
import { parseUploadedFile } from "../../../../utils/fileUpload";

const FileUploader = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = async (files) => {
    if (files.length === 0) return;

    const file = files[0];
    setUploadStatus({ type: "loading", message: "Processing file..." });

    try {
      const result = await parseUploadedFile(file);

      if (result.success) {
        setUploadStatus({
          type: "success",
          message: `File processed successfully: ${result.fileName}`,
        });
        onFileUpload(result);
      } else {
        setUploadStatus({ type: "error", message: result.error });
      }
    } catch (error) {
      setUploadStatus({ type: "error", message: "Failed to process file" });
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle template downloads
  const handleDownloadTemplate = () => {
    const result = downloadTemplate();
    if (result.success) {
      setUploadStatus({ type: "success", message: result.message });
    } else {
      setUploadStatus({ type: "error", message: result.message });
    }
  };

  const handleDownloadJSONTemplate = () => {
    const result = downloadJSONTemplate();
    if (result.success) {
      setUploadStatus({ type: "success", message: result.message });
    } else {
      setUploadStatus({ type: "error", message: result.message });
    }
  };

  return (
    <div className={styles.commonSection}>
      <div className={styles.sectionTitle}>
        <i className="bi bi-cloud-upload me-2"></i>
        Bulk Payout Upload
      </div>

      {/* Template Download Section */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Download Template:</label>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleDownloadTemplate}
            disabled={isLoading}
          >
            <i className="bi bi-download me-2"></i>
            CSV Template
          </button>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleDownloadJSONTemplate}
            disabled={isLoading}
          >
            <i className="bi bi-download me-2"></i>
            JSON Template
          </button>
        </div>
        <small className="text-muted">
          Download the template file, fill in your beneficiary data, and upload
          it below.
        </small>
      </div>

      {/* File Upload Section */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Upload File:</label>
        <div
          className={`border-2 border-dashed rounded p-3 text-center ${
            dragActive ? "border-primary bg-light" : "border-secondary"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{ cursor: "pointer", minHeight: "120px" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mb-2">
            <i className="bi bi-cloud-upload fa-2x text-muted mb-2"></i>
            <div>
              <strong>Drag & drop your file here</strong>
              <br />
              <span className="text-muted">or click to browse</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="d-none"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <div className="text-muted">
            <small>Supported: CSV, Excel, JSON | Max: 5MB</small>
          </div>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div
          className={`alert ${
            uploadStatus.type === "success"
              ? styles.successAlert
              : uploadStatus.type === "error"
              ? styles.dangerAlert
              : "alert-info"
          } d-flex align-items-center`}
        >
          {uploadStatus.type === "loading" && (
            <div
              className={`spinner-border spinner-border-sm me-2 ${styles.primarySpinner}`}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {uploadStatus.type === "success" && (
            <i className="bi bi-check-circle me-2"></i>
          )}
          {uploadStatus.type === "error" && (
            <i className="bi bi-exclamation-triangle me-2"></i>
          )}
          {uploadStatus.message}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
