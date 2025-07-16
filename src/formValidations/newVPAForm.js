import {
  validateName,
  validateEmail,
  validateContact,
  validateDecimalNumber,
  validateEmpty,
} from "../utils/validations"; // adjust path as needed

export const validateAddVPAForm = (formData) => {
  const errors = {};

  // Name
  const nameError = validateEmpty(formData.name) || validateName(formData.name);
  if (nameError) errors.name = nameError;

  // Nickname
  const nicknameError = validateEmpty(formData.nickname) || validateName(formData.nickname);
  if (nicknameError) errors.nickname = nicknameError;

  // Mobile
  const mobileEmptyError = validateEmpty(formData.mobile);
  const mobileFormatError = !mobileEmptyError ? validateContact(formData.mobile) : null;
  if (mobileEmptyError) {
    errors.mobile = "Mobile number is required";
  } else if (mobileFormatError) {
    errors.mobile = mobileFormatError;
  }

  // Email
  const emailEmptyError = validateEmpty(formData.email);
  const emailFormatError = !emailEmptyError ? validateEmail(formData.email) : null;
  if (emailEmptyError) {
    errors.email = "Email is required";
  } else if (emailFormatError) {
    errors.email = emailFormatError;
  }

  // VPA Address
  const vpaEmptyError = validateEmpty(formData.vpaAddress);
  if (vpaEmptyError) {
    errors.vpaAddress = "VPA Address is required";
  } else if (!formData.vpaAddress.includes("@")) {
    errors.vpaAddress = "Invalid VPA address";
  }

  // Transaction Amount
  const amountEmptyError = validateEmpty(formData.transactionAmmount);
  const amountFormatError = !amountEmptyError ? validateDecimalNumber(formData.transactionAmmount) : null;
  if (amountEmptyError) {
    errors.transactionAmmount = "Amount is required";
  } else if (amountFormatError) {
    errors.transactionAmmount = amountFormatError;
  }

  // Mode of Transaction
  const modeError = validateEmpty(formData.transactionBankTransferMode);
  if (modeError) errors.transactionBankTransferMode = "Transaction mode is required";

  return errors;
};