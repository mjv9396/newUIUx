"use client";
import React from "react";

const BeneficiaryDetails = ({ name, onClose, data }) => {
  return (
    <div className="modal custom-modal">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Beneficiary Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Merchant Name:</strong> {name}
                </p>
                <p className="mb-1">
                  <strong>Beneficiary Name:</strong> {data?.name || "NA"}
                </p>
                <p className="mb-1">
                  <strong>Alias:</strong> {data?.alias || "NA"}
                </p>
                <p className="mb-1">
                  <strong>Contact Number:</strong> {data?.contactNumber || "NA"}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {data?.email || "NA"}
                </p>
              </div>
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">Account Details</h6>
                  </div>
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>Account Number:</strong> {data?.accountNumber || "NA"}
                    </p>
                    <p className="mb-1">
                      <strong>IFSC Code:</strong> {data?.ifscCode || "NA"}
                    </p>
                    <p className="mb-1">
                      <strong>Bank Name:</strong> {data?.bankName || "NA"}
                    </p>
                    <p className="mb-1">
                      <strong>Account Type:</strong> {data?.accountType || "NA"}
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">VPA Details</h6>
                  </div>
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>VPA:</strong> {data?.vpa || "NA"}
                    </p>
                    <p className="mb-1">
                      <strong>UPI App:</strong> {data?.upiApp || "NA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {data?.remarks && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">Remarks</h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{data.remarks}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {data?.status && (
              <div className="row mt-3">
                <div className="col-12">
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        data.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {data.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            {data?.createdAt && (
              <div className="row mt-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Created At:</strong> {data.createdAt}
                  </p>
                </div>
                {data?.updatedAt && (
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Last Updated:</strong> {data.updatedAt}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetails;