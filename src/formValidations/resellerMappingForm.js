import { validateEmpty } from "../utils/validations"; // Adjust import path as needed

export const validateResellerMappingForm = (formData) => {
  const errors = {};

  // Reseller ID validation
  if (validateEmpty(formData.resellerId)) {
    errors.resellerId = "Reseller is required";
  }

  // Merchant ID validation
  if (validateEmpty(formData.merchantId)) {
    errors.merchantId = "Merchant is required";
  }

  return errors;
};