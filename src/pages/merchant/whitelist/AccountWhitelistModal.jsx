import { useState, useEffect } from "react";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../utils/messges";
import { validateEmpty, validateName } from "../../../utils/validations";

const AccountWhitelistModal = ({
  show,
  onHide,
  onSaved,
  editingAccount,
  selectedMerchant,
}) => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
    branch: "",
    accountType: "Savings",
    userId: selectedMerchant,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const {
    postData: addAccount,
    data: addResponse,
    loading: addLoading,
  } = usePost(endpoints.user.addBankAccount);

  // Handle modal body scroll
  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);

  // Bank account validation function
  const validateBankAccount = (formData) => {
    let errors = {};

    // Account Number validation
    const accountNumberError = validateEmpty(formData.accountNumber);
    if (accountNumberError) {
      errors.accountNumber = accountNumberError;
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      errors.accountNumber = "Account number must be 9-18 digits";
    }

    // IFSC Code validation
    const ifscError = validateEmpty(formData.ifscCode);
    if (ifscError) {
      errors.ifscCode = ifscError;
    } else if (
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())
    ) {
      errors.ifscCode = "Invalid IFSC code format (e.g., SBIN0123456)";
    }

    // Account Holder Name validation
    const nameError = validateName(formData.accountHolderName);
    if (nameError) errors.accountHolderName = nameError;

    // Bank Name validation
    const bankNameError = validateEmpty(formData.bankName);
    if (bankNameError) errors.bankName = bankNameError;

    // Branch validation
    const branchError = validateEmpty(formData.branch);
    if (branchError) errors.branch = branchError;

    // Account Type validation
    const accountTypeError = validateEmpty(formData.accountType);
    if (accountTypeError) errors.accountType = accountTypeError;

    return errors;
  };

  // Populate form data when editing
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        accountNumber: editingAccount.accountNumber || "",
        ifscCode: editingAccount.ifscCode || "",
        accountHolderName: editingAccount.accountHolderName || "",
        bankName: editingAccount.bankName || "",
        branch: editingAccount.branch || "",
        accountType: editingAccount.accountType || "Savings",
        userId: selectedMerchant,
      });
    } else {
      setFormData({
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
        branch: "",
        accountType: "Savings",
        userId: selectedMerchant,
      });
    }
    setErrors({});
    setTouched({});
  }, [editingAccount, selectedMerchant]);

  // Handle successful add/update
  useEffect(() => {
    if (addResponse && !addLoading) {
      if (addResponse.statusCode === 200 || addResponse.statusCode === 201) {
        successMessage(
          editingAccount
            ? "Bank account updated successfully"
            : "Bank account added successfully"
        );
        onSaved();
      } else {
        errorMessage(addResponse.data || "Failed to save bank account");
      }
    }
  }, [addResponse, addLoading, editingAccount, onSaved]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert IFSC code to uppercase
    const processedValue = name === "ifscCode" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    const fieldErrors = validateBankAccount({ [fieldName]: value });
    setErrors((prev) => ({
      ...prev,
      [fieldName]: fieldErrors[fieldName] || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(
      allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    // Validate all fields
    const formErrors = validateBankAccount(formData);
    setErrors(formErrors);

    // Check if there are any validation errors
    if (Object.keys(formErrors).length > 0) {
      errorMessage("Please fix the validation errors");
      return;
    }

    try {
      await addAccount(formData);
    } catch (error) {
      errorMessage("An error occurred while saving the account");
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      {show && <div className="modal-backdrop fade show"></div>}

      {/* Modal */}
      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingAccount ? "Edit Bank Account" : "Add Bank Account"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                disabled={addLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="accountNumber" className="form-label">
                        Account Number <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.accountNumber && touched.accountNumber
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter account number"
                      />
                      {errors.accountNumber && touched.accountNumber && (
                        <div className="invalid-feedback">
                          {errors.accountNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="ifscCode" className="form-label">
                        IFSC Code <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="ifscCode"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.ifscCode && touched.ifscCode
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter IFSC code"
                        style={{ textTransform: "uppercase" }}
                      />
                      {errors.ifscCode && touched.ifscCode && (
                        <div className="invalid-feedback">
                          {errors.ifscCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="accountHolderName" className="form-label">
                        Account Holder Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="accountHolderName"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.accountHolderName && touched.accountHolderName
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter account holder name"
                      />
                      {errors.accountHolderName &&
                        touched.accountHolderName && (
                          <div className="invalid-feedback">
                            {errors.accountHolderName}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="bankName" className="form-label">
                        Bank Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.bankName && touched.bankName
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter bank name"
                      />
                      {errors.bankName && touched.bankName && (
                        <div className="invalid-feedback">
                          {errors.bankName}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="branchName" className="form-label">
                        Branch Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="branchName"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.branchName && touched.branchName
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter branch name"
                      />
                      {errors.branchName && touched.branchName && (
                        <div className="invalid-feedback">
                          {errors.branchName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="accountType" className="form-label">
                        Account Type <span className="required">*</span>
                      </label>
                      <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        style={{padding: "12px", border: "2px solid gray", borderRadius: "4px"}}
                        className={`form-control ${
                          errors.accountType && touched.accountType
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="">Select Account Type</option>
                        <option value="saving">Saving Account</option>
                        <option value="current">Current Account</option>
                      </select>
                      {errors.accountType && touched.accountType && (
                        <div className="invalid-feedback">
                          {errors.accountType}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={addLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={addLoading}
              >
                {addLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    {editingAccount ? "Updating..." : "Adding..."}
                  </>
                ) : editingAccount ? (
                  "Update Account"
                ) : (
                  "Add Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountWhitelistModal;
