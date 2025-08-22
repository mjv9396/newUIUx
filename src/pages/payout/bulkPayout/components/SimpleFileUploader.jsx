import { useState, useRef } from "react";
import styles from "../../../../styles/common/Add.module.css";
import { parseUploadedFile } from "../../../../utils/fileUpload";

const SimpleFileUploader = ({ onFileUpload, isLoading }) => {
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
          message: `File processed: ${result.fileName}`,
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

  return (
    <div className="d-flex align-items-center gap-2">
      {/* Compact Upload Button */}
      <button
        className={styles.refreshBtn}
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <i className="bi bi-cloud-upload me-2"></i>
        {isLoading ? "Processing..." : "Upload File"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        className="d-none"
        accept=".csv,.xlsx,.xls,.json"
        onChange={handleInputChange}
        disabled={isLoading}
      />

      {/* Status Indicator */}
      {uploadStatus && (
        <div className="d-flex align-items-center">
          {uploadStatus.type === "loading" && (
            <div
              className={`spinner-border spinner-border-sm me-2 ${styles.primarySpinner}`}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {/* {uploadStatus.type === "success" && (
            <i className="bi bi-check-circle text-success me-1"></i>
          )} */}
          {uploadStatus.type === "error" && (
            <i className="bi bi-exclamation-triangle text-danger me-1"></i>
          )}
          {/* <small
            className={
              uploadStatus.type === "success"
                ? "text-success"
                : uploadStatus.type === "error"
                ? "text-danger"
                : "text-info"
            }
          >
            {uploadStatus.message}
          </small> */}
        </div>
      )}
    </div>
  );
};

export default SimpleFileUploader;
