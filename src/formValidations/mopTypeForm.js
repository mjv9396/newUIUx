import {
  validateName,
  validateEmpty,
} from "../utils/validations"; // adjust path as needed

export const validateMopTypeForm = (formData) => {
  let errors = {};

  // Validate mopName
  const mopNameEmpty = validateEmpty(formData.mopName);
  const mopNameFormat = !mopNameEmpty ? validateName(formData.mopName) : null;
  if (mopNameEmpty) {
    errors.mopName = "MOP Name is required";
  } else if (mopNameFormat) {
    errors.mopName = mopNameFormat;
  }

  // Validate mopCode
  if (validateEmpty(formData.mopCode)) {
    errors.mopCode = "Code is required";
  }

  // Validate countryCode
  if (validateEmpty(formData.countryCode)) {
    errors.countryCode = "Country Code is required";
  }

  // Validate currencyCode
  if (validateEmpty(formData.currencyCode)) {
    errors.currencyCode = "Currency Code is required";
  }

  // Validate paymentTypeCode
  if (validateEmpty(formData.paymentTypeCode)) {
    errors.paymentTypeCode = "Payment Type Code is required";
  }

  return errors;
};