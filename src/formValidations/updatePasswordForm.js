import { errorMessage } from "../utils/messges";
import { validateEmpty, validatePassword } from "../utils/validations";

export const validateUpdatePasswordForm = async (formData) => {
  let errors = {};

  // Current Password
  const currentPasswordEmpty = validateEmpty(formData.currentPassword);
  if (currentPasswordEmpty) {
    errors.currentPassword = "Current password is required";
  }

  // New Password
  const newPasswordEmpty = validateEmpty(formData.newPassword);
  const newPasswordFormat = !newPasswordEmpty ? validatePassword(formData.newPassword) : null;
  if (newPasswordEmpty) {
    errors.newPassword = "New password is required";
  } else if (newPasswordFormat) {
    errors.newPassword = newPasswordFormat;
  }

  // New password should not be same as current password
  if (
    !errors.currentPassword &&
    !errors.newPassword &&
    formData.currentPassword === formData.newPassword
  ) {
    errors.newPassword = "New password cannot be the same as the current password.";
  }

  return errors;
};