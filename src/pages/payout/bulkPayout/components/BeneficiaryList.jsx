import { useState, useEffect } from "react";
import styles from "../../../../styles/common/Add.module.css";

const BeneficiaryList = ({
  beneficiaries,
  onTransfer,
  isTransferring,
  validationErrors,
  transferMode,
}) => {
  // Get duplicate order IDs from validation errors
  const getDuplicateOrderIds = () => {
    if (!validationErrors) return [];

    const duplicateError = validationErrors.find(
      (error) => error.type === "duplicate_order_ids"
    );
    return duplicateError ? duplicateError.affectedRows : [];
  };

  // Get field validation errors
  const getFieldErrors = () => {
    if (!validationErrors) return [];

    const fieldError = validationErrors.find(
      (error) => error.type === "field_validation"
    );
    return fieldError ? fieldError.rowErrors : [];
  };

  // Get errors for a specific row
  const getRowErrors = (rowIndex) => {
    const fieldErrors = getFieldErrors();
    const rowError = fieldErrors.find((error) => error.row === rowIndex + 1);
    return rowError ? rowError.errors : [];
  };

  // Check if a specific field has error for a row
  const hasFieldError = (rowIndex, fieldName) => {
    const rowErrors = getRowErrors(rowIndex);
    return rowErrors.some((error) =>
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  // Get specific field error message
  const getFieldErrorMessage = (rowIndex, fieldName) => {
    const rowErrors = getRowErrors(rowIndex);
    const fieldError = rowErrors.find((error) =>
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
    return fieldError || null;
  };

  const duplicateRows = getDuplicateOrderIds();
  const fieldErrors = getFieldErrors();

  // Handle transfer (all beneficiaries are automatically selected)
  const handleTransfer = () => {
    onTransfer(beneficiaries);
  };

  // Calculate total amount (all beneficiaries)
  const totalAmount = beneficiaries.reduce((sum, beneficiary) => {
    return sum + parseFloat(beneficiary?.amount || 0);
  }, 0);

  if (!beneficiaries || beneficiaries.length === 0) {
    return null;
  }

  return (
    <>
      {/* Validation Errors - Compact Display */}
      {validationErrors && validationErrors.length > 0 && (
        <div
          className={`alert alert-danger py-2 mb-3`}
          style={{ fontSize: "0.85rem" }}
        >
          <div className="d-flex align-items-start">
            <i
              className="bi bi-exclamation-triangle me-2 mt-1"
              style={{ fontSize: "0.9rem" }}
            ></i>
            <div className="flex-grow-1">
              <strong style={{ fontSize: "0.9rem" }}>Issues Found:</strong>
              <div className="mt-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="mb-1">
                    {error.type === "duplicate_order_ids" && (
                      <span className="text-nowrap me-3">
                        <i className="bi bi-arrow-repeat me-1"></i>
                        Duplicate Order IDs (rows:{" "}
                        {error.affectedRows.map((row) => row + 1).join(", ")})
                      </span>
                    )}
                    {error.type === "field_validation" && (
                      <span className="text-nowrap">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {error.rowErrors.length} field error(s)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beneficiaries Table */}
      <div className={styles.tableContainer} style={{ maxHeight: "60vh" }}>
        <table className="table table-striped table-hover mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Amount</th>
              <th>Account No</th>
              <th>IFSC</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary, index) => {
              const isDuplicate = duplicateRows.includes(index);
              const rowErrors = getRowErrors(index);
              const hasErrors = isDuplicate || rowErrors.length > 0;

              return (
                <tr
                  key={index}
                  style={hasErrors ? { backgroundColor: "#f8d7da" } : {}}
                  className={hasErrors ? "table-danger" : ""}
                >
                  <td>
                    <span
                      className={`badge ${
                        isDuplicate ? "bg-danger" : "bg-secondary"
                      }`}
                    >
                      {beneficiary.orderId ||
                        beneficiary.OrderID ||
                        beneficiary.order_id}
                    </span>
                    {isDuplicate && (
                      <div className="mt-1">
                        <small
                          className="text-danger fw-semibold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Duplicate
                        </small>
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <strong>{beneficiary.name}</strong>
                      {beneficiary.nickName && (
                        <>
                          <br />
                          <small className="text-muted">
                            ({beneficiary.nickName})
                          </small>
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <i className="bi bi-phone me-1"></i>
                      {beneficiary.mobile}
                    </div>
                    {hasFieldError(index, "mobile") && (
                      <div className="mt-1">
                        <small
                          className="text-danger fw-semibold"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          {getFieldErrorMessage(index, "mobile")}
                        </small>
                      </div>
                    )}
                  </td>
                  <td>
                    <div>
                      <span className={`fw-bold ${styles.primaryText}`}>
                        ₹ {parseFloat(beneficiary.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    {hasFieldError(index, "amount") && (
                      <div className="mt-1">
                        <small
                          className="text-danger fw-semibold"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          {getFieldErrorMessage(index, "amount")}
                        </small>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="font-monospace">
                      {beneficiary.accountNo}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">
                      {beneficiary.ifsc}
                    </span>
                  </td>
                  <td>
                    <div>
                      <i className="bi bi-envelope me-1"></i>
                      <small>{beneficiary.email}</small>
                    </div>
                    {hasFieldError(index, "email") && (
                      <div className="mt-1">
                        <small
                          className="text-danger fw-semibold"
                          style={{ fontSize: "0.7rem" }}
                        >
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          {getFieldErrorMessage(index, "email")}
                        </small>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary below table */}
      <div className="mt-3">
        <div className="card">
          <div className="card-body p-2">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="d-flex justify-content-start">
                  <span className={`h5 mb-0 ${styles.primaryText}`}>
                    Total Amount: ₹ {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="col-md-6 text-end">
                <button
                  className={styles.refreshBtn}
                  onClick={handleTransfer}
                  disabled={
                    isTransferring ||
                    (validationErrors && validationErrors.length > 0) ||
                    !transferMode
                  }
                  title={
                    validationErrors && validationErrors.length > 0
                      ? "Fix validation errors before proceeding"
                      : "Transfer all beneficiaries"
                  }
                >
                  {isTransferring ? (
                    <>
                      <div
                        className={`spinner-border spinner-border-sm me-2 ${styles.primarySpinner}`}
                        role="status"
                      >
                        <span className="visually-hidden">Processing...</span>
                      </div>
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Transfer All ({beneficiaries.length})
                    </>
                  )}
                </button>
                {validationErrors && validationErrors.length > 0 && (
                  <div className="mt-1">
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Fix errors to enable transfer
                    </small>
                  </div>
                )}
                {!transferMode && (
                  <div className="mt-1">
                    <small
                      className="text-danger"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Select a transfer mode to proceed
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BeneficiaryList;
