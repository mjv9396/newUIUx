/* eslint-disable react/prop-types */
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../../../styles/common/Modal.module.css";
import classes from "../../../styles/common/Add.module.css";
import useFileUpload from "../../../hooks/useFileUpload";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage } from "../../../utils/messges";

const Backdrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Overlay = ({ userId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: userId,
    documentType: "",
    documentNumber: "",
    file: null,
  });
  const [errors, setErrors] = useState({});

  const { uploadData, loading, error } = useFileUpload();

  const documentTypes = [
    { value: "AADHAAR_CARD", label: "Aadhaar Card" },
    { value: "PAN_CARD", label: "PAN Card" },
    { value: "PAN_CARD_BUSINESS", label: "Business PAN Card" },
    { value: "GST", label: "GST Certificate" },
    { value: "CIN", label: "CIN Certificate" },
    { value: "UDYAM", label: "Udyam Registration" },
    { value: "BANK_BUSINESS", label: "Business Bank Statement" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.documentType) {
      newErrors.documentType = "Document type is required";
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = "Document number is required";
    }

    if (!formData.file) {
      newErrors.file = "Document file is required";
    } else {
      // Validate file type (images and PDFs only)
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(formData.file.type)) {
        newErrors.file = "Only JPEG, PNG, and PDF files are allowed";
      }

      // Validate file size (max 5MB)
      if (formData.file.size > 5 * 1024 * 1024) {
        newErrors.file = "File size must be less than 5MB";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("userId", formData.userId);
      formDataToSend.append("documentType", formData.documentType);
      formDataToSend.append("documentNumber", formData.documentNumber);
      formDataToSend.append("file", formData.file);

      const response = await uploadData(
        endpoints.kyc.saveKycDocument,
        formDataToSend
      );

      if (response?.data) {
        successMessage("Document uploaded successfully");
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Upload error:", error);
    }
  }, [error]);

  return (
    <div className={styles.modal}>
      <div
        className="d-flex justify-content-between mb-1 position-sticky top-0 z-2 bg-white py-4"
        id={styles.title}
      >
        <h6>Add KYC Document</h6>
        <i className="bi bi-x" onClick={onClose}></i>
      </div>
      <div className={styles.detail}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-3 position-relative">
              <label htmlFor="documentType" className="form-label fw-bold">
                Document Type{" "}
                <span style={{ color: "var(--required)" }}>*</span>
              </label>
              <select
                className={`form-select ${
                  errors.documentType ? "is-invalid" : ""
                }`}
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                style={{
                  borderColor: formData.documentType ? "var(--primary)" : "",
                  boxShadow: formData.documentType
                    ? "0 0 0 0.2rem rgba(19, 102, 170, 0.25)"
                    : "",
                }}
              >
                <option value="">Select Document Type</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.documentType && (
                <div className="invalid-feedback">{errors.documentType}</div>
              )}
            </div>

            <div className="col-12 mb-3 position-relative">
              <label htmlFor="documentNumber" className="form-label fw-bold">
                Document Number{" "}
                <span style={{ color: "var(--required)" }}>*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.documentNumber ? "is-invalid" : ""
                }`}
                id="documentNumber"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="Enter document number"
                style={{
                  borderColor: formData.documentNumber ? "var(--primary)" : "",
                  boxShadow: formData.documentNumber
                    ? "0 0 0 0.2rem rgba(19, 102, 170, 0.25)"
                    : "",
                }}
              />
              {errors.documentNumber && (
                <div className="invalid-feedback">{errors.documentNumber}</div>
              )}
            </div>

            <div className="col-12 mb-3 position-relative">
              <label htmlFor="file" className="form-label fw-bold">
                Document File{" "}
                <span style={{ color: "var(--required)" }}>*</span>
              </label>
              <input
                type="file"
                className={`form-control ${errors.file ? "is-invalid" : ""}`}
                id="file"
                name="file"
                onChange={handleChange}
                accept=".jpg,.jpeg,.png,.pdf"
                style={{
                  borderColor: formData.file ? "var(--primary)" : "",
                  boxShadow: formData.file
                    ? "0 0 0 0.2rem rgba(19, 102, 170, 0.25)"
                    : "",
                }}
              />
              {errors.file && (
                <div className="invalid-feedback">{errors.file}</div>
              )}
              <small className="form-text" style={{ color: "var(--gray)" }}>
                Supported formats: JPEG, PNG, PDF (Max size: 5MB)
              </small>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className={`${classes.submit} ${classes.active}`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
            <button
              type="button"
              className={classes.clear}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddDocumentModal = ({ userId, onClose, onSuccess }) => {
  return (
    <Fragment>
      {createPortal(<Backdrop />, document.getElementById("backdrop"))}
      {createPortal(
        <Overlay userId={userId} onClose={onClose} onSuccess={onSuccess} />,
        document.getElementById("overlay")
      )}
    </Fragment>
  );
};

export default AddDocumentModal;
