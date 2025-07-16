import { validateEmpty, validateEmail, validateContact, validateDecimalNumber } from "../utils/validations";

export const validateAddVPAForm = (formData) => {
  const errors = {};

  // Name
  if (validateEmpty(formData.name)) {
    errors.name = "Beneficiary name is required";
  }

  // Nickname
  if (validateEmpty(formData.nickname)) {
    errors.nickname = "Nickname is required";
  }

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
  if (validateEmpty(formData.vpaAddress)) {
    errors.vpaAddress = "VPA address is required";
  } else if (!formData.vpaAddress.includes("@")) {
    errors.vpaAddress = "Invalid VPA address";
  }

  // Amount
  const amountEmptyError = validateEmpty(formData.transactionAmmount);
  const amountFormatError = !amountEmptyError ? validateDecimalNumber(formData.transactionAmmount) : null;
  if (amountEmptyError) {
    errors.transactionAmmount = "Amount is required";
  } else if (amountFormatError) {
    errors.transactionAmmount = amountFormatError;
  }

  // Transaction Mode
  if (validateEmpty(formData.transactionBankTransferMode)) {
    errors.transactionBankTransferMode = "Transaction mode is required";
  }

  return errors;
};