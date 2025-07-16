import {
  validateEmpty,
  validateEmail,
  validateDecimalNumber,
  validateContact,
  validateName,
  validateVpa,
  validateIntegerNumber,
} from "../utils/validations";

export const validateSendMoneyForm = (formData) => {
  const errors = {};

  const orderIdEmptyError = validateEmpty(formData.orderId);
  
  if (orderIdEmptyError) {
    errors.orderId = orderIdFormatError;
  } 

  const nameEmptyError = validateEmpty(formData.name);
  const nameFormatError = !nameEmptyError ? validateName(formData.name) : null;
  if (nameEmptyError) {
    errors.name = "Beneficiary Name is required";
  } else if (nameFormatError) {
    errors.name = nameFormatError;
  }

  const nicknameEmptyError = validateEmpty(formData.nickname);
  const nicknameFormatError = !nicknameEmptyError
    ? validateName(formData.nickname)
    : null;

  if (nicknameEmptyError) {
    errors.nickname = "Beneficiary Nickname is required";
  } else if (nicknameFormatError) {
    errors.nickname = nicknameFormatError;
  }

  const mobileEmptyError = validateEmpty(formData.mobile);
  const mobileFormatError = !mobileEmptyError
    ? validateContact(formData.mobile)
    : null;
  if (mobileEmptyError) {
    errors.mobile = "Mobile number is required";
  } else if (mobileFormatError) {
    errors.mobile = mobileFormatError;
  }

  const emailEmptyError = validateEmpty(formData.email);
  const emailFormatError = !emailEmptyError
    ? validateEmail(formData.email)
    : null;
  if (emailEmptyError) {
    errors.email = "Email address is required";
  } else if (emailFormatError) {
    errors.email = emailFormatError;
  }

  const amountEmptyError = validateEmpty(formData.transactionAmmount);
  const amountFormatError = !amountEmptyError
    ? validateDecimalNumber(formData.transactionAmmount)
    : null;
  if (amountEmptyError) {
    errors.transactionAmmount = "Amount is required";
  } else if (amountFormatError) {
    errors.transactionAmmount = amountFormatError;
  }

  const modeError = validateEmpty(formData.transactionBankTransferMode);
  if (modeError)
    errors.transactionBankTransferMode = "Transaction mode is required";

  if (formData.transactionBankTransferMode === "UPI") {
    const vpaEmptyError = validateEmpty(formData.vpaAddress);
    const vpaFormatError = vpaEmptyError
      ? validateVpa(formData.vpaAddress)
      : null;

    if (vpaEmptyError) {
      errors.vpaAddress = "VPA Address is required";
    } else if (vpaFormatError) {
      errors.vpaAddress = vpaFormatError;
    }
  } else {
    const accountNoEmptyError = validateEmpty(formData.accountNo);
    const accountFormatError = accountNoEmptyError
      ? validateIntegerNumber(formData.accountNo)
      : null;
    if (accountNoEmptyError) {
      errors.accountNo = "Account Number is required";
    } else if (accountFormatError) {
      errors.accountNo = accountFormatError;
    }
    const ifscError = validateEmpty(formData.ifscCode);
    if (ifscError) errors.ifscCode = "IFSC Code is required";
  }

  return errors;
};
