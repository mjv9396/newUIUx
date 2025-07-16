export const validatePayoutAcquirerProfileForm = (formData) => {
  const error = {};

  // Personal Details validation
  if (!formData.acqCode) {
    error.acqCode = "Acquirer Code is required";
  }
  if (!formData.currencyCode) {
    error.currencyCode = "Currency Code is required";
  }
  if (!formData.firstName) {
    error.firstName = "First Name is required";
  }
  if (!formData.lastName) {
    error.lastName = "Last Name is required";
  }
  if (!formData.phone) {
    error.phone = "Contact Number is required";
  }
  if (!formData.email) {
    error.email = "Email is required";
  }
  if (!formData.dailyAmountLimit) {
    error.dailyAmountLimit = "Daily Amount Limit is required";
  } else if (
    isNaN(formData.dailyAmountLimit) ||
    Number(formData.dailyAmountLimit) <= 0
  ) {
    error.dailyAmountLimit = "Daily Amount Limit must be a positive number";
  }

  return error;
};
