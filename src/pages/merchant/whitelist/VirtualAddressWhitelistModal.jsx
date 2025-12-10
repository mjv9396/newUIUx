import { useState, useEffect } from "react";
import usePost from "../../../hooks/usePost";
import useFetch from "../../../hooks/useFetch";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage, errorMessage } from "../../../utils/messges";
import {
  validateEmpty,
  validateName,
  validateEmail,
  validateContact,
} from "../../../utils/validations";

const VirtualAddressWhitelistModal = ({
  show,
  onHide,
  onSaved,
  editingWhitelist,
  selectedMerchant,
}) => {
  const [formData, setFormData] = useState({
    virtualAccountId: "",
    userName: "",
    userEmail: "",
    userMobile: "",
    accountNumber: "",
    ifscCode: "",
    userId: selectedMerchant,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Fetch virtual accounts for the selected merchant
  const {
    fetchData: getVirtualAccounts,
    data: virtualAccountsData,
    loading: virtualAccountsLoading,
  } = useFetch();

  const {
    postData: addWhitelist,
    data: addResponse,
    loading: addLoading,
  } = usePost(endpoints.user.addVirtualAddressWhitelist);

  // Handle modal body scroll
  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show]);

  // Fetch virtual accounts when merchant is selected
  useEffect(() => {
    if (selectedMerchant) {
      // TODO: Update endpoint when API is ready - this should fetch virtual accounts for the merchant
      getVirtualAccounts(
        endpoints.payin.virtualAccountSummary + selectedMerchant
      );
    }
  }, [selectedMerchant]);

  // Validation function
  const validateVirtualAddressWhitelist = (formData) => {
    let errors = {};

    // Virtual Account validation
    const virtualAccountError = validateEmpty(formData.virtualAccountId);
    if (virtualAccountError) {
      errors.virtualAccountId = virtualAccountError;
    }

    // User Name validation
    const nameError = validateName(formData.userName);
    if (nameError) errors.userName = nameError;

    // User Email validation
    const emailError = validateEmail(formData.userEmail);
    if (emailError) errors.userEmail = emailError;

    // User Mobile validation
    const mobileError = validateContact(formData.userMobile);
    if (mobileError) errors.userMobile = mobileError;

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

    return errors;
  };

  // Populate form data when editing
  useEffect(() => {
    if (editingWhitelist) {
      setFormData({
        virtualAccountId: editingWhitelist.virtualAccountId || "",
        userName: editingWhitelist.userName || "",
        userEmail: editingWhitelist.userEmail || "",
        userMobile: editingWhitelist.userMobile || "",
        accountNumber: editingWhitelist.accountNumber || "",
        ifscCode: editingWhitelist.ifscCode || "",
        userId: selectedMerchant,
      });
    } else {
      setFormData({
        virtualAccountId: "",
        userName: "",
        userEmail: "",
        userMobile: "",
        accountNumber: "",
        ifscCode: "",
        userId: selectedMerchant,
      });
    }
    setErrors({});
    setTouched({});
  }, [editingWhitelist, selectedMerchant]);

  // Handle successful add/update
  useEffect(() => {
    if (addResponse && !addLoading) {
      if (addResponse.statusCode === 200 || addResponse.statusCode === 201) {
        successMessage(
          editingWhitelist
            ? "Virtual address whitelist updated successfully"
            : "Virtual address whitelist added successfully"
        );
        onSaved();
      } else {
        errorMessage(
          addResponse.data || "Failed to save virtual address whitelist"
        );
      }
    }
  }, [addResponse, addLoading, editingWhitelist, onSaved]);

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
    const fieldErrors = validateVirtualAddressWhitelist({ [fieldName]: value });
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
    const formErrors = validateVirtualAddressWhitelist(formData);
    setErrors(formErrors);

    // Check if there are any validation errors
    if (Object.keys(formErrors).length > 0) {
      errorMessage("Please fix the validation errors");
      return;
    }

    try {
      // TODO: Update endpoint and payload when API is ready
      await addWhitelist(formData);
    } catch (error) {
      errorMessage("An error occurred while saving the whitelist");
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
                {editingWhitelist
                  ? "Edit Virtual Address Whitelist"
                  : "Add Virtual Address Whitelist"}
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
                  <div className="col-md-12">
                    <div className="mb-3 position-relative">
                      <label htmlFor="virtualAccountId" className="form-label">
                        Virtual Account <span className="required">*</span>
                      </label>
                      <select
                        id="virtualAccountId"
                        name="virtualAccountId"
                        value={formData.virtualAccountId}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        style={{
                          padding: "12px",
                          border: "2px solid gray",
                          borderRadius: "4px",
                        }}
                        className={`form-control ${
                          errors.virtualAccountId && touched.virtualAccountId
                            ? "is-invalid"
                            : ""
                        }`}
                        disabled={virtualAccountsLoading || editingWhitelist}
                      >
                        <option value="">Select Virtual Account</option>
                        {virtualAccountsData?.data?.content?.length > 0 ? (
                          virtualAccountsData.data.content.map((account) => (
                            <option
                              key={account.virtualAccountId || account.id}
                              value={account.virtualAccountId || account.id}
                            >
                              {account.virtualAccountNumber} -{" "}
                              {account.beneficiaryName ||
                                account.accountHolderName ||
                                ""}
                            </option>
                          ))
                        ) : (
                          <option disabled>
                            No virtual accounts available
                          </option>
                        )}
                      </select>
                      {errors.virtualAccountId && touched.virtualAccountId && (
                        <div className="invalid-feedback">
                          {errors.virtualAccountId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="userName" className="form-label">
                        User Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.userName && touched.userName
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter user name"
                      />
                      {errors.userName && touched.userName && (
                        <div className="invalid-feedback">
                          {errors.userName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="userEmail" className="form-label">
                        User Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="userEmail"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.userEmail && touched.userEmail
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter user email"
                      />
                      {errors.userEmail && touched.userEmail && (
                        <div className="invalid-feedback">
                          {errors.userEmail}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3 position-relative">
                      <label htmlFor="userMobile" className="form-label">
                        User Mobile <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="userMobile"
                        name="userMobile"
                        value={formData.userMobile}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${
                          errors.userMobile && touched.userMobile
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter user mobile"
                        maxLength={10}
                      />
                      {errors.userMobile && touched.userMobile && (
                        <div className="invalid-feedback">
                          {errors.userMobile}
                        </div>
                      )}
                    </div>
                  </div>
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
                </div>

                <div className="row g-3">
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
                        maxLength={11}
                      />
                      {errors.ifscCode && touched.ifscCode && (
                        <div className="invalid-feedback">
                          {errors.ifscCode}
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
                    {editingWhitelist ? "Updating..." : "Adding..."}
                  </>
                ) : editingWhitelist ? (
                  "Update Whitelist"
                ) : (
                  "Add Whitelist"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VirtualAddressWhitelistModal;
