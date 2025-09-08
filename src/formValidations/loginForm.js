import { validateEmail, validateEmpty } from "../utils/validations";

export const validateLoginForm = (formdata) => {
  let errors = {};

  // Username (Email)
  const emailEmptyError = validateEmpty(formdata.username);
  const emailFormatError = !emailEmptyError ? validateEmail(formdata.username) : null;
  if (emailEmptyError) {
    errors.username = "Email is required";
  } else if (emailFormatError) {
    errors.username = "Please enter a valid email address";
  }

  // Password
  const passwordEmptyError = validateEmpty(formdata.password);
  if (passwordEmptyError) {
    errors.password = "Password is required";
  }

  // Captcha
  const captchaEmptyError = validateEmpty(formdata.captcha);
  if (captchaEmptyError) {
    errors.captcha = "Captcha is required";
  }

  return errors;
};