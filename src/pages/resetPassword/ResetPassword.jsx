import { useEffect, useState } from "react";
import { resetPasswordForm } from "../../forms/auth";
import usePost from "../../hooks/usePost";
import DashboardLayout from "../../layouts/DashboardLayout";
import { endpoints } from "../../services/apiEndpoints";
import styles from "../../styles/common/Add.module.css";
import { validateUpdatePasswordForm } from "../../formValidations/updatePasswordForm";

import { errorMessage, successMessage } from "../../utils/messges";
import useFetch from "../../hooks/useFetch";
import { clearCookieStorage } from "../../services/cookieStore";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  // form handlers
  const [formData, setFormData] = useState(resetPasswordForm);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };
  // API handlers
  const { postData, data, error, loading } = usePost(
    endpoints.user.updatePassword
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = await validateUpdatePasswordForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    await postData(formData);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (data && data?.statusCode < 400 && !error) {
      successMessage("Password Updated Successfully");
      setFormData(resetPasswordForm);
      clearCookieStorage();
      navigate("/session-out");
    }
    if (error || (data && data?.statusCode >= 400)) {
      errorMessage(
        data?.error?.detailMessage || error?.message || "Something went wrong"
      );
    }
  }, [error, data]);

  return (
    <DashboardLayout page="Update Password" url="/dashboard/update-password">
      <div className={styles.listing}>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-wrap gap-3 align-items-center ">
            <div className={styles.input}>
              <label htmlFor="currentPassword">
                Current Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                placeholder="Enter Current Password"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.currentPassword}
                required
              />
              {errors.currentPassword && (
                <span className="errors">{errors.currentPassword}</span>
              )}
            </div>
            <div className={styles.input}>
              <label htmlFor="newPassword">
                New Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                autoComplete="on"
                maxLength={256}
                onChange={handleChange}
                value={formData.newPassword}
                required
              />
              {errors.newPassword && (
                <span className="errors">{errors.newPassword}</span>
              )}
            </div>
            <div className="d-flex gap-3 mt-4 justify-content-end">
              <button
                className={
                  !loading ? styles.submit + " " + styles.active : styles.submit
                }
                type="submit"
              >
                Update
              </button>
              <button
                className={styles.clear}
                type="reset"
                onClick={() => setFormData(resetPasswordForm)}
              >
                clear
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ResetPassword;
