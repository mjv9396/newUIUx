import { useEffect, useState } from "react";
import { otpVerificationForm } from "../../../forms/auth";
import styles from "../../../styles/loginWithUsernameAndPassword/Form.module.css";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { successMessage } from "../../../utils/messges";

export default function OtpVerificationForm({ registerFormData, onSelect }) {
  const {
    postData: register,
    data: registerData,
    error: registerError,
    loading: registerLoading,
  } = usePost(endpoints.registration);

  // form handlers
  const [errors, setErrors] = useState({});

  const [emailOtpDisabled, setEmailOtpDisabled] = useState(false);
  const [phoneOtpDisabled, setPhoneOtpDisabled] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Timer states
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);

  // otp form handlers
  const [otpFormData, setOtpFormData] = useState(otpVerificationForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtpFormData({ ...otpFormData, [name]: value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(registerFormData);
  };

  useEffect(() => {
    if (registerData && !registerError) {
      successMessage("Your account has been created successfully.");
      onSelect("login");
    }
  }, [registerData, registerError]);

  // Timer effects
  useEffect(() => {
    let interval;
    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setEmailOtpDisabled(false);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval;
    if (phoneTimer > 0) {
      interval = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setPhoneOtpDisabled(false);
    }
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const {
    postData: sendEmailOtp,
    loading: sendEmailOtpLoading,
    data: sendEmailOtpResponse,
    error: sendEmailOtpError,
  } = usePost(endpoints.sendEmailOtp);

  const {
    postData: sendPhoneOtp,
    loading: sendPhoneOtpLoading,
    data: sendPhoneOtpResponse,
    error: sendPhoneOtpError,
  } = usePost(endpoints.sendPhoneOtp);

  const {
    postData: verifyEmailOtp,
    loading: emailOtpLoading,
    data: emailOtpResponse,
    error: emailOtpError,
  } = usePost(endpoints.verifyEmailOtp);

  const {
    postData: verifyPhoneOtp,
    loading: phoneOtpLoading,
    data: phoneOtpResponse,
    error: phoneOtpError,
  } = usePost(endpoints.verifyPhoneOtp);

  const handleResendEmailOtp = async () => {
    await sendEmailOtp({ email: registerFormData.email });
    setEmailOtpDisabled(true);
    setEmailTimer(300); // 5 minutes = 300 seconds
  };

  const handleVerifyEmailOtp = async () => {
    await verifyEmailOtp({
      email: registerFormData.email,
      otp: otpFormData.emailOtp,
    });
  };

  const handleResendPhoneOtp = async () => {
    await sendPhoneOtp({ phone: registerFormData.phone });
    setPhoneOtpDisabled(true);
    setPhoneTimer(300); // 5 minutes = 300 seconds
  };

  const handleVerifyPhoneOtp = async () => {
    await verifyPhoneOtp({
      phone: registerFormData.phone,
      countryCode: registerFormData.countryCode,
      otp: otpFormData.phoneOtp,
    });
  };

  useEffect(() => {
    if (emailOtpResponse && !emailOtpError) {
      successMessage(
        emailOtpResponse.message || "Email verified successfully."
      );
      setEmailVerified(true);
    }
  }, [emailOtpResponse, emailOtpError]);

  useEffect(() => {
    if (phoneOtpResponse && !phoneOtpError) {
      successMessage(
        phoneOtpResponse.message || "Phone Number verified successfully."
      );
      setPhoneVerified(true);
    }
  }, [phoneOtpResponse, phoneOtpError]);

  useEffect(() => {
    if (sendEmailOtpResponse && !sendEmailOtpError) {
      successMessage(
        sendEmailOtpResponse.message || "Email OTP sent successfully."
      );
    }
  }, [sendEmailOtpResponse, sendEmailOtpError]);

  useEffect(() => {
    if (sendPhoneOtpResponse && !sendPhoneOtpError) {
      successMessage(
        sendPhoneOtpResponse.message || "Phone OTP sent successfully."
      );
    }
  }, [sendPhoneOtpResponse, sendPhoneOtpError]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row mt-3">
        <div className="col-md-12 col-sm-12 mb-3 position-relative">
          <label htmlFor="emailOtp">
            Email OTP <span className="required">*</span>
          </label>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              placeholder="Enter email OTP"
              autoComplete="off"
              name="emailOtp"
              id="emailOtp"
              onChange={handleChange}
              disabled={emailVerified}
              value={otpFormData.emailOtp}
              className="flex-grow-1"
            />
            <button
              type="button"
              className={"w-25 " + styles.loginbutton}
              onClick={handleVerifyEmailOtp}
            >
              {emailOtpLoading
                ? "Verifying..."
                : emailVerified
                ? "Verified"
                : "Verify"}
            </button>
          </div>
          <div className="">
            <button
              type="button"
              onClick={handleResendEmailOtp}
              disabled={emailOtpDisabled || sendEmailOtpLoading}
              className={styles.resend}
              style={{
                cursor:
                  emailOtpDisabled || sendEmailOtpLoading
                    ? "not-allowed"
                    : "pointer",

                opacity: emailOtpDisabled || sendEmailOtpLoading ? 0.6 : 1,
              }}
            >
              {sendEmailOtpLoading
                ? "Loading..."
                : emailTimer > 0
                ? `Resend OTP (${formatTime(emailTimer)})`
                : "Resend OTP"}
            </button>
          </div>
          {errors.emailOtp && <span className="errors">{errors.emailOtp}</span>}
        </div>

        <div className="col-md-12 col-sm-12 mb-3 position-relative">
          <label htmlFor="phoneOtp">
            Phone OTP <span className="required">*</span>
          </label>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              placeholder="Enter phone OTP"
              autoComplete="off"
              name="phoneOtp"
              id="phoneOtp"
              onChange={handleChange}
              disabled={phoneVerified}
              value={otpFormData.phoneOtp}
              className="flex-grow-1"
            />
            <button
              type="button"
              className={"w-25 " + styles.loginbutton}
              onClick={handleVerifyPhoneOtp}
            >
              {phoneOtpLoading
                ? "Verifying..."
                : phoneVerified
                ? "Verified"
                : "Verify"}
            </button>
          </div>
          <div className="">
            <button
              type="button"
              onClick={handleResendPhoneOtp}
              disabled={phoneOtpDisabled || sendPhoneOtpLoading}
              className={styles.resend}
              style={{
                cursor:
                  phoneOtpDisabled || sendPhoneOtpLoading
                    ? "not-allowed"
                    : "pointer",

                opacity: phoneOtpDisabled || sendPhoneOtpLoading ? 0.6 : 1,
              }}
            >
              {sendPhoneOtpLoading
                ? "Loading..."
                : phoneTimer > 0
                ? `Resend OTP (${formatTime(phoneTimer)})`
                : "Resend OTP"}
            </button>
          </div>
          {errors.phoneOTP && <span className="errors">{errors.phoneOTP}</span>}
        </div>
      </div>

      <div className="col-12 mb-4">
        <button
          type="submit"
          disabled={!emailVerified || !phoneVerified}
          className={styles.loginbutton}
        >
          {registerLoading ? "loading..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
