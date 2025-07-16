import { validateEmail, validatePassword, validateEmpty } from "../utils/validations";

export const validateLoginForm = (formdata) => {
  let errors = {};

  // Username (Email)
  const emailEmptyError = validateEmpty(formdata.username);
  const emailFormatError = !emailEmptyError ? validateEmail(formdata.username) : null;
  if (emailEmptyError) {
    errors.username = "Email is required";
  } else if (emailFormatError) {
    errors.username = emailFormatError;
  }

  // Password
  const passwordEmptyError = validateEmpty(formdata.password);
  if (passwordEmptyError) {
    errors.password = "Password is required";
  } 

  return errors;
};