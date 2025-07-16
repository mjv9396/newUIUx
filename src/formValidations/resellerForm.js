import {
  validateEmpty,
  validateEmail,
  validateContact,
  validatePassword,
  validateName
} from "../utils/validations"; // Adjust the path if needed

export const validateAddResellerForm = (formData) => {
  const errors = {};

  // First Name
  const emptyNameError = validateEmpty(formData.firstName);
  const nameFormatError = !emptyNameError ? validateName(formData.firstName) : null;
  if (emptyNameError) {
    errors.firstName = "First name is required";
  } else if (nameFormatError) {
    errors.firstName = nameFormatError;
  }

  // Last Name
  const emptyLastNameError = validateEmpty(formData.lastName);
  const lastNameFormatError = !emptyLastNameError ? validateName(formData.lastName) : null;
  if (emptyLastNameError) {
    errors.lastName = "Last name is required";
  } else if (lastNameFormatError) {
    errors.lastName = lastNameFormatError;
  }

  // Email
  const emailEmptyError = validateEmpty(formData.email);
  const emailFormatError = !emailEmptyError ? validateEmail(formData.email) : null;
  if (emailEmptyError) {
    errors.email = "Email is required";
  } else if (emailFormatError) {
    errors.email = emailFormatError;
  }

  // Phone Number
  const phoneEmptyError = validateEmpty(formData.phoneNumber);
  const phoneFormatError = !phoneEmptyError ? validateContact(formData.phoneNumber) : null;
  if (phoneEmptyError) {
    errors.phoneNumber = "Phone number is required";
  } else if (phoneFormatError) {
    errors.phoneNumber = phoneFormatError;
  }

  // Organisation Type
  if (validateEmpty(formData.organisationType)) {
    errors.organisationType = "Organisation type is required";
  }

  // Business Name
  const businessNameEmptyError = validateEmpty(formData.businessName);
  const businessNameFormatError = !businessNameEmptyError ? validateName(formData.businessName) : null;
  if (businessNameEmptyError) {
    errors.businessName = "Business name is required";
  } else if (businessNameFormatError) {
    errors.businessName = businessNameFormatError;
  }

  // Industry Category
  if (validateEmpty(formData.industryCategory)) {
    errors.industryCategory = "Industry category is required";
  }

  // Industry Sub-category
  if (validateEmpty(formData.industrySubCategory)) {
    errors.industrySubCategory = "Industry sub-category is required";
  }

  // Password
  const passwordEmptyError = validateEmpty(formData.password);
  const passwordFormatError = !passwordEmptyError ? validatePassword(formData.password) : null;
  if (passwordEmptyError) {
    errors.password = "Password is required";
  } else if (passwordFormatError) {
    errors.password = passwordFormatError;
  }

  return errors;
};