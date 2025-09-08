import {
  validateEmpty,
  validateDecimalNumber,
} from "../utils/validations";

export const validateInternalTransferForm = (formData, maxBalance) => {
  const errors = {};

  // Amount validation
  const amountEmptyError = validateEmpty(formData.amount);
  const amountFormatError = !amountEmptyError
    ? validateDecimalNumber(formData.amount)
    : null;

  if (amountEmptyError) {
    errors.amount = "Amount is required";
  } else if (amountFormatError) {
    errors.amount = amountFormatError;
  } else if (parseFloat(formData.amount) <= 0) {
    errors.amount = "Amount must be greater than 0";
  } else if (parseFloat(formData.amount) > maxBalance) {
    errors.amount = "Amount cannot exceed available balance";
  }

  // Merchant App ID validation
  const merchantAppIdEmptyError = validateEmpty(formData.merchantAppId);
  if (merchantAppIdEmptyError) {
    errors.merchantAppId = "Merchant App ID is required";
  }

  // Re-enter Merchant App ID validation
  const reenterMerchantAppIdEmptyError = validateEmpty(formData.reenterMerchantAppId);
  if (reenterMerchantAppIdEmptyError) {
    errors.reenterMerchantAppId = "Please re-enter Merchant App ID";
  } else if (formData.merchantAppId !== formData.reenterMerchantAppId) {
    errors.reenterMerchantAppId = "Merchant App IDs do not match";
  }

  // Captcha validation
  const captchaEmptyError = validateEmpty(formData.captcha);
  if (captchaEmptyError) {
    errors.captcha = "Captcha is required";
  }

  return errors;
};
