import {
  validateContact,
  validateEmail,
  validateEmpty,
  validateIntegerNumber,
  validateName,
  validatePassword,
} from "../utils/validations";

export const validateAcquirerProfileForm = (formdata) => {
  let errors = {};

  // Acquirer Code
  const acqCodeError = validateEmpty(formdata.acqCode);
  if (acqCodeError) errors.acqCode = "Acquirer code is required";

  // Currency Code
  const currencyCodeError = validateEmpty(formdata.currencyCode);
  if (currencyCodeError) errors.currencyCode = "Currency code is required";

  // First Name
  const firstNameEmptyError = validateEmpty(formdata.firstName);
  const firstNameError = !firstNameEmptyError ? validateName(formdata.firstName) : null;
  if (firstNameEmptyError) {
    errors.firstName = "First name is required";
  }else if (firstNameError) {
    errors.firstName = firstNameError;
  }




  // Last Name
  const lastNameEmptyError = validateEmpty(formdata.lastName);
  const lastNameError = !lastNameEmptyError ? validateName(formdata.lastName) : null;
  if (lastNameEmptyError) {
    errors.lastName = "Last name is required";
  }else if (lastNameError) {
    errors.lastName = lastNameError;
  }

  // Contact Number
  const contactEmptyError = validateEmpty(formdata.phone);
  const contactFormatError = !contactEmptyError ? validateContact(formdata.phone) : null;
  if (contactEmptyError) {
    errors.phone = "Contact number is required";
    errors.phone = "Contact number is required";
  } else if (contactFormatError) {
    errors.phone = contactFormatError;
    errors.phone = contactFormatError;
  }

  // Email
  const emailEmptyError = validateEmpty(formdata.email);
  const emailFormatError = !emailEmptyError
    ? validateEmail(formdata.email)
    : null;
  if (emailEmptyError) {
    errors.email = "Email is required";
  } else if (emailFormatError) {
    errors.email = emailFormatError;
  }
  // Password
  const passwordEmptyError = validateEmpty(formdata.password);
  const passwordFormatError = !passwordEmptyError
    ? validatePassword(formdata.password)
    : null;
  if (passwordEmptyError) {
    errors.password = "Password is required";
  } else if (passwordFormatError) {
    errors.password = passwordFormatError;
  }

  // Daily Amount Limit
  const dailyAmountLimitEmptyError = validateIntegerNumber(formdata.dailyAmountLimit);
  if (dailyAmountLimitEmptyError) {
    errors.dailyAmountLimit = "Daily amount limit is required";
  } else if (
    isNaN(formdata.dailyAmountLimit) ||
    Number(formdata.dailyAmountLimit) <= 0
  ) {
    errors.dailyAmountLimit = "Daily amount limit must be a positive number";
  }

  return errors;
};
