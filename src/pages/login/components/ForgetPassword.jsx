/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/login/Form.module.css";
import usePost from "../../../hooks/usePost";
import { successMessage, errorMessage } from "../../../utils/messges";
import { endpoints } from "../../../services/apiEndpoints";

const ForgetPassword = ({ onSelect }) => {
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Send OTP API (FormData, pass true)
  const {
    postData: sendOtp,
    data: otpData,
    error: otpError,
    loading: otpLoading,
  } = usePost(endpoints.sendOtp, true);

  // Reset Password API (JSON)
  const {
    postData: resetPassword,
    data: resetData,
    error: resetError,
    loading: resetLoading,
  } = usePost(endpoints.resetPassword);

  // Handle send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    await sendOtp(formData);
  };

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    if (!newPassword) {
      setErrors({ newPassword: "New password is required" });
      return;
    }
    await resetPassword({ email, otp, newPassword });
  };

  // Step change on OTP send
  useEffect(() => {
    if (otpData?.statusCode < 400 && !otpError) {
      successMessage(otpData?.data || "OTP sent to your email");
      setStep("otp");
    }
    if (otpData?.statusCode >= 400 || otpError) {
      errorMessage(otpData?.error?.detailMessage || "Failed to send OTP");
    }
  }, [otpData, otpError]);

  // On password reset success
  useEffect(() => {
    if (resetData?.statusCode < 400) {
      successMessage(resetData?.data || "Password reset successfully");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setStep("email");
      onSelect("login");
    }
    if (resetData?.statusCode >= 400) {
      errorMessage(resetData?.error?.detailMessage || "Failed to reset password");
      
    }
  }, [resetData, resetError, onSelect]);

  return (
    <div className={styles.form}>
      <h6>Forgot Password</h6>
      <div className="col-12">
        <small>
          {step === "email"
            ? "Enter your email and we will send you an OTP."
            : "Enter the OTP sent to your email and set a new password."}
        </small>
      </div>
      <div className="row mt-3">
        {step === "email" && (
          <form onSubmit={handleSendOtp}>
            <div className="col-12 mb-4">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your registered email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="errors">{errors.email}</span>
              )}
            </div>
            <div className="col-12 mb-4">
              <button
                type="submit"
                className={styles.loginbutton}
                disabled={otpLoading}
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
            <div className="col-12">
              <small>
                <Link to="#" role="button" onClick={() => onSelect("login")}>
                  Back to login
                </Link>
              </small>
            </div>
          </form>
        )}
        {step === "otp" && (
          <form onSubmit={handleResetPassword}>
            <div className="col-12 mb-4">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                autoComplete="off"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {errors.otp && (
                <span className="errors">{errors.otp}</span>
              )}
            </div>
            <div className="col-12 mb-4">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                autoComplete="off"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && (
                <span className="errors">{errors.newPassword}</span>
              )}
            </div>
            <div className="col-12 mb-4">
              <button
                type="submit"
                className={styles.loginbutton}
                disabled={resetLoading}
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
            <div className="col-12">
              <small>
                <Link to="#" role="button" onClick={() => onSelect("login")}>
                  Back to login
                </Link>
              </small>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;