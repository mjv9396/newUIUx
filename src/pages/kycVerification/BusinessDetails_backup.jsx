import { useState } from "react";
import styles from "../../styles/kycVerification/KycVerification.module.css";

export default function BusinessDetails({ formData, handleChange, errors }) {
  const companyTypes = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "llp", label: "Limited Liability Partnership (LLP)" },
    { value: "pvt_ltd", label: "Private Limited Company (Pvt Ltd)" },
    { value: "plc", label: "Public Limited Company (PLC)" },
    { value: "llc", label: "Limited Liability Company (LLC)" },
    { value: "cooperative", label: "Cooperative (Co-op)" },
    { value: "corporation", label: "Corporation (C-Corp)" },
    { value: "s_corp", label: "S Corporation (S-Corp)" },
    { value: "non_profit", label: "Non-Profit Organization" },
    { value: "branch_office", label: "Branch Office" },
    { value: "joint_venture", label: "Joint Venture" },
    { value: "trust", label: "Trust" },
    { value: "franchise", label: "Franchise" },
    { value: "freelancer", label: "Freelancer/Independent Contractor" },
  ];

  const businessCategories = [
    { value: "retail", label: "Retail" },
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "finance_insurance", label: "Finance & Insurance" },
    { value: "education", label: "Education" },
    { value: "construction_real_estate", label: "Construction & Real Estate" },
    { value: "marketing_advertising", label: "Marketing & Advertising" },
    { value: "hospitality", label: "Hospitality" },
    { value: "professional_services", label: "Professional Services" },
    { value: "entertainment_media", label: "Entertainment & Media" },
    { value: "transportation_logistics", label: "Transportation & Logistics" },
    { value: "non_profit", label: "Non-Profit & NGOs" },
    { value: "agriculture", label: "Agriculture" },
    { value: "energy", label: "Energy" },
    { value: "legal_compliance", label: "Legal & Compliance" },
    { value: "art_design", label: "Art & Design" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-building me-2"></i>
            Business Information
          </h4>
          <p className="mb-0 mt-2 text-light">
            Please provide accurate business details for verification
          </p>
        </div>

        <div className="card-body">
          <div className="row">
            {/* Business Name */}
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <label htmlFor="companyName" className="form-label">
                <i className="bi bi-briefcase-fill me-1"></i>
                Business Name <span className="text-danger">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Enter your registered business name"
                autoComplete="organization"
                name="companyName"
                id="companyName"
                className={`form-control ${
                  errors.companyName ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.companyName}
              />
              {errors.companyName && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.companyName}
                </div>
              )}
            </div>

            {/* Business Type */}
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <label htmlFor="companyType" className="form-label">
                <i className="bi bi-diagram-2-fill me-1"></i>
                Business Type <span className="text-danger">*</span>
              </label>
              <select
                name="companyType"
                id="companyType"
                required
                className={`form-select ${
                  errors.companyType ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.companyType}
              >
                <option value="">Select business type</option>
                {companyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.companyType && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.companyType}
                </div>
              )}
            </div>

            {/* Business Category */}
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <label htmlFor="companyCategory" className="form-label">
                <i className="bi bi-tag-fill me-1"></i>
                Business Category <span className="text-danger">*</span>
              </label>
              <select
                name="companyCategory"
                id="companyCategory"
                required
                className={`form-select ${
                  errors.companyCategory ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.companyCategory}
              >
                <option value="">Select business category</option>
                {businessCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.companyCategory && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.companyCategory}
                </div>
              )}
            </div>

            {/* Business Phone */}
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <label htmlFor="companyPhone" className="form-label">
                <i className="bi bi-telephone-fill me-1"></i>
                Business Phone <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Enter business phone number"
                autoComplete="tel-national"
                name="companyPhone"
                id="companyPhone"
                className={`form-control ${
                  errors.companyPhone ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.companyPhone}
              />
              {errors.companyPhone && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.companyPhone}
                </div>
              )}
            </div>

            {/* Business Email */}
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <label htmlFor="companyEmail" className="form-label">
                <i className="bi bi-envelope-fill me-1"></i>
                Business Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Enter business email address"
                autoComplete="email"
                name="companyEmail"
                id="companyEmail"
                className={`form-control ${
                  errors.companyEmail ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.companyEmail}
              />
              {errors.companyEmail && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.companyEmail}
                </div>
              )}
            </div>

            {/* Business Website */}
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
              <label htmlFor="companyWebsite" className="form-label">
                <i className="bi bi-globe me-1"></i>
                Business Website
                <span className="text-muted ms-1">(Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://www.example.com"
                autoComplete="url"
                name="companyWebsite"
                id="companyWebsite"
                className={`form-control ${
                  errors.companyWebsite ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.companyWebsite}
              />
              {errors.companyWebsite && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.companyWebsite}
                </div>
              )}
            </div>
          </div>

          {/* Cert-In Compliance Section */}
          <hr className="my-4" />
          <div className="mb-4">
            <h5>
              <i className="bi bi-shield-check me-2"></i>
              Cert-In Compliance
            </h5>
            <p className="text-muted">
              Please specify if your business is Cert-In compliant
            </p>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-8 col-sm-12 mb-3">
              <label htmlFor="certInCompliant" className="form-label">
                <i className="bi bi-patch-check me-1"></i>
                Is your business Cert-In compliant?{" "}
                <span className="text-danger">*</span>
              </label>
              <select
                name="certInCompliant"
                id="certInCompliant"
                required
                className={`form-select ${
                  errors.certInCompliant ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                value={formData.certInCompliant}
              >
                <option value="">Select compliance status</option>
                <option value="yes">Yes, we are Cert-In compliant</option>
                <option value="no">No, we are not Cert-In compliant</option>
              </select>
              {errors.certInCompliant && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.certInCompliant}
                </div>
              )}
            </div>

            {formData.certInCompliant === "yes" && (
              <div className="col-lg-6 col-md-4 col-sm-12 mb-3">
                <label htmlFor="certInDocument" className="form-label">
                  <i className="bi bi-file-earmark-check me-1"></i>
                  Upload Cert-In Compliance Certificate{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  name="certInDocument"
                  id="certInDocument"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className={`form-control ${
                    errors.certInDocument ? "is-invalid" : ""
                  }`}
                  onChange={handleChange}
                />
                {errors.certInDocument && (
                  <div className="invalid-feedback">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {errors.certInDocument}
                  </div>
                )}
                {formData.certInDocument && !errors.certInDocument && (
                  <div className="text-success mt-1">
                    <i className="bi bi-check-circle me-1"></i>
                    Certificate uploaded successfully
                  </div>
                )}
                <div className="form-text">
                  <i className="bi bi-info-circle me-1"></i>
                  Upload PDF, DOC, or image formats (max 5MB)
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="progress mb-2" style={{ height: "8px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{
                  width: `${
                    (((formData.companyName ? 1 : 0) +
                      (formData.companyType ? 1 : 0) +
                      (formData.companyCategory ? 1 : 0) +
                      (formData.companyPhone ? 1 : 0) +
                      (formData.companyEmail ? 1 : 0) +
                      (formData.certInCompliant ? 1 : 0) +
                      (formData.certInCompliant === "yes"
                        ? formData.certInDocument
                          ? 1
                          : 0
                        : 1)) /
                      7) *
                    100
                  }%`,
                }}
                aria-valuenow={Math.round(
                  (((formData.companyName ? 1 : 0) +
                    (formData.companyType ? 1 : 0) +
                    (formData.companyCategory ? 1 : 0) +
                    (formData.companyPhone ? 1 : 0) +
                    (formData.companyEmail ? 1 : 0) +
                    (formData.certInCompliant ? 1 : 0) +
                    (formData.certInCompliant === "yes"
                      ? formData.certInDocument
                        ? 1
                        : 0
                      : 1)) /
                    7) *
                    100
                )}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Form completion:{" "}
              {Math.round(
                (((formData.companyName ? 1 : 0) +
                  (formData.companyType ? 1 : 0) +
                  (formData.companyCategory ? 1 : 0) +
                  (formData.companyPhone ? 1 : 0) +
                  (formData.companyEmail ? 1 : 0) +
                  (formData.certInCompliant ? 1 : 0) +
                  (formData.certInCompliant === "yes"
                    ? formData.certInDocument
                      ? 1
                      : 0
                    : 1)) /
                  7) *
                  100
              )}
              %
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
