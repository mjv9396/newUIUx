import {
  validateDecimalNumber,
  validateEmpty,
  validateGST
} from "../utils/validations"; // adjust import path as needed

export const validatePayoutChargingDetailForm = (formData) => {
  const errors = {};

  // Required dropdowns
  const userIdError = validateEmpty(formData.userId);
  if (userIdError) errors.userId = "Merchant is required";

  const acquirerError = validateEmpty(formData.acquirer);
  if (acquirerError) errors.acquirer = "Acquirer is required";

  const transferModeError = validateEmpty(formData.transferMode);
  if (transferModeError) errors.transferMode = "Transfer Mode is required";

  const currencyCodeError = validateEmpty(formData.currencyCode);
  if (currencyCodeError) errors.currencyCode = "Currency Code is required";

  // Bank TDR Fields
  const bankMinTxnAmountEmpty = validateEmpty(formData.bankMinTxnAmount);
  const bankMinTxnAmountFormat = !bankMinTxnAmountEmpty ? validateDecimalNumber(formData.bankMinTxnAmount) : null;
  if (bankMinTxnAmountEmpty) {
    errors.bankMinTxnAmount = "Bank Min Txn Amount is required";
  } else if (bankMinTxnAmountFormat) {
    errors.bankMinTxnAmount = bankMinTxnAmountFormat;
  }

  const bankMaxTxnAmountEmpty = validateEmpty(formData.bankMaxTxnAmount);
  const bankMaxTxnAmountFormat = !bankMaxTxnAmountEmpty ? validateDecimalNumber(formData.bankMaxTxnAmount) : null;
  if (bankMaxTxnAmountEmpty) {
    errors.bankMaxTxnAmount = "Bank Max Txn Amount is required";
  } else if (bankMaxTxnAmountFormat) {
    errors.bankMaxTxnAmount = bankMaxTxnAmountFormat;
  }

  const bankTdrEmpty = validateEmpty(formData.bankTdr);
  const bankTdrFormat = !bankTdrEmpty ? validateDecimalNumber(formData.bankTdr) : null;
  if (bankTdrEmpty) {
    errors.bankTdr = "Bank TDR is required";
  } else if (bankTdrFormat) {
    errors.bankTdr = bankTdrFormat;
  }

  const bankPreferenceError = validateEmpty(formData.bankPreference);
  if (bankPreferenceError) errors.bankPreference = "Bank Preference is required";

  // Merchant TDR Fields
  const merchantMinTxnAmountEmpty = validateEmpty(formData.merchantMinTxnAmount);
  const merchantMinTxnAmountFormat = !merchantMinTxnAmountEmpty ? validateDecimalNumber(formData.merchantMinTxnAmount) : null;
  if (merchantMinTxnAmountEmpty) {
    errors.merchantMinTxnAmount = "Merchant Min Txn Amount is required";
  } else if (merchantMinTxnAmountFormat) {
    errors.merchantMinTxnAmount = merchantMinTxnAmountFormat;
  }

  const merchantMaxTxnAmountEmpty = validateEmpty(formData.merchantMaxTxnAmount);
  const merchantMaxTxnAmountFormat = !merchantMaxTxnAmountEmpty ? validateDecimalNumber(formData.merchantMaxTxnAmount) : null;
  if (merchantMaxTxnAmountEmpty) {
    errors.merchantMaxTxnAmount = "Merchant Max Txn Amount is required";
  } else if (merchantMaxTxnAmountFormat) {
    errors.merchantMaxTxnAmount = merchantMaxTxnAmountFormat;
  }

  const merchantTdrEmpty = validateEmpty(formData.merchantTdr);
  const merchantTdrFormat = !merchantTdrEmpty ? validateDecimalNumber(formData.merchantTdr) : null;
  if (merchantTdrEmpty) {
    errors.merchantTdr = "Merchant TDR is required";
  } else if (merchantTdrFormat) {
    errors.merchantTdr = merchantTdrFormat;
  }

  const merchantPreferenceError = validateEmpty(formData.merchantPreference);
  if (merchantPreferenceError) errors.merchantPreference = "Merchant Preference is required";

  // Other TDR
  const gstEmpty = validateEmpty(formData.gst);
  const gstFormat = !gstEmpty ? validateGST(formData.gst) : null;
  if (gstEmpty) {
    errors.gst = "GST Number is required";
  } else if (gstFormat) {
    errors.gst = gstFormat;
  }

  const vendorCommisionEmpty = validateEmpty(formData.vendorCommision);
  const vendorCommisionFormat = !vendorCommisionEmpty ? validateDecimalNumber(formData.vendorCommision) : null;
  if (vendorCommisionEmpty) {
    errors.vendorCommision = "Vendor Commission is required";
  } else if (vendorCommisionFormat) {
    errors.vendorCommision = vendorCommisionFormat;
  }

  return errors;
};