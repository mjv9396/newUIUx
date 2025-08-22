/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "../../../styles/loginWithUsernameAndPassword/Form.module.css";
import { useEffect, useState } from "react";
import { validateRegistrationForm } from "../../../formValidations/registrationFrom";
import { signupForm } from "../../../forms/auth";
import { staticData } from "./IndustryTypeData";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { errorMessage, successMessage } from "../../../utils/messges";
import { validateContact, validateEmail } from "../../../utils/validations";
import PasswordStrengthIndicator from "../../../components/PasswordStrengthIndicator";

const SignupForm = ({ onSelect }) => {
  // form handlers
  const [formData, setFormData] = useState(signupForm);
  const [errors, setErrors] = useState({});
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [industrySubCategory, setIndustrySubCategory] = useState([]);

  // Email OTP states
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpDisabled, setEmailOtpDisabled] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  // Phone OTP states
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpDisabled, setPhoneOtpDisabled] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);

  const handleChange = (e) => {
    const { name, value, selectedIndex } = e.target;

    // For phone number, limit to 10 digits and only allow numbers
    if (name === "phoneNumber") {
      // Remove any non-digit characters
      const cleanValue = value.replace(/\D/g, "");
      // Limit to 10 digits
      if (cleanValue.length <= 10) {
        setFormData({ ...formData, [name]: cleanValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "industryCategory")
      setIndustrySubCategory(staticData[selectedIndex - 1].sub);
    setErrors({});
  };

  const handleConfirmPassword = (e) => {
    if (formData.password === e.target.value) {
      setConfirmPasswordError(null);
      return;
    }
    setConfirmPasswordError(true);
  };

  // API hooks
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

  const {
    postData: register,
    data: registerData,
    error: registerError,
    loading: registerLoading,
  } = usePost(endpoints.registration);

  // Email OTP handlers
  const handleSendEmailOtp = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    await sendEmailOtp({ email: formData.email });
    setEmailOtpDisabled(true);
    setEmailTimer(300); // 5 minutes
  };

  const handleVerifyEmailOtp = async () => {
    await verifyEmailOtp({
      email: formData.email,
      otp: emailOtp,
    });
  };

  const handleResendEmailOtp = async () => {
    await sendEmailOtp({ email: formData.email });
    setEmailOtpDisabled(true);
    setEmailTimer(300);
  };

  // Phone OTP handlers
  const handleSendPhoneOtp = async () => {
    const phoneError = validateContact(formData.phoneNumber);
    if (phoneError) {
      setErrors({ phoneNumber: phoneError });
      return;
    }
    await sendPhoneOtp({
      mobileNumber: formData.phoneNumber,
      countryCode: "91",
    });
    setPhoneOtpDisabled(true);
    setPhoneTimer(300);
  };

  const handleVerifyPhoneOtp = async () => {
    await verifyPhoneOtp({
      mobileNumber: formData.phoneNumber,
      countryCode: "91",
      otp: phoneOtp,
    });
  };

  const handleResendPhoneOtp = async () => {
    await sendPhoneOtp({
      mobileNumber: formData.phoneNumber,
      countryCode: "91",
    });
    setPhoneOtpDisabled(true);
    setPhoneTimer(300);
  };

  // Final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.confirmpassword.value !== formData.password) {
      setConfirmPasswordError(true);
      return;
    }
    const validationError = validateRegistrationForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      return;
    }
    // if (!emailVerified || !phoneVerified) {
    //   return;
    // }
    await register(formData);
  };

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

  // Response handlers
  useEffect(() => {
    if (sendEmailOtpResponse?.statusCode < 400 && !sendEmailOtpError) {
      successMessage(
        sendEmailOtpResponse?.data ?? "Email OTP sent successfully"
      );
      setEmailOtpSent(true);
    }
    if (sendEmailOtpResponse?.statusCode >= 400) {
      const errorMsg = sendEmailOtpResponse?.data;
      if (
        errorMsg?.includes("already exists") ||
        errorMsg?.includes("already registered")
      ) {
        errorMessage(
          "This email is already registered. Please use a different email or try logging in."
        );
      } else {
        errorMessage(errorMsg ?? "Failed to send email OTP");
      }
    }
    if (sendEmailOtpError) {
      errorMessage(
        "Failed to send email OTP. Please check your internet connection and try again."
      );
    }
  }, [sendEmailOtpResponse, sendEmailOtpError]);

  useEffect(() => {
    if (sendPhoneOtpResponse?.statusCode < 400 && !sendPhoneOtpError) {
      successMessage(
        sendPhoneOtpResponse?.data ?? "Phone OTP sent successfully"
      );
      setPhoneOtpSent(true);
    }
    if (sendPhoneOtpResponse?.statusCode >= 400) {
      const errorMsg = sendPhoneOtpResponse?.data;
      if (
        errorMsg?.includes("already exists") ||
        errorMsg?.includes("already registered")
      ) {
        errorMessage(
          "This phone number is already registered. Please use a different number or try logging in."
        );
      } else {
        errorMessage(errorMsg ?? "Failed to send phone OTP");
      }
    }
    if (sendPhoneOtpError) {
      errorMessage(
        "Failed to send phone OTP. Please check your internet connection and try again."
      );
    }
  }, [sendPhoneOtpResponse, sendPhoneOtpError]);

  useEffect(() => {
    if (emailOtpResponse?.statusCode < 400 && !emailOtpError) {
      successMessage(emailOtpResponse?.data ?? "Email verified successfully");
      setEmailVerified(true);
      setEmailOtpSent(false);
    }
    if (emailOtpResponse?.statusCode >= 400) {
      const errorMsg = emailOtpResponse?.data;
      if (errorMsg?.includes("invalid") || errorMsg?.includes("incorrect")) {
        errorMessage("Invalid OTP. Please check and try again.");
      } else if (errorMsg?.includes("expired")) {
        errorMessage("OTP has expired. Please request a new one.");
      } else {
        errorMessage(errorMsg ?? "Failed to verify email OTP");
      }
    }
    if (emailOtpError) {
      errorMessage(
        "Failed to verify email OTP. Please check your internet connection and try again."
      );
    }
  }, [emailOtpResponse, emailOtpError]);

  useEffect(() => {
    if (phoneOtpResponse?.statusCode < 400 && !phoneOtpError) {
      successMessage(phoneOtpResponse?.data ?? "Phone verified successfully");
      setPhoneVerified(true);
      setPhoneOtpSent(false);
    }
    if (phoneOtpResponse?.statusCode >= 400) {
      const errorMsg = phoneOtpResponse?.data;
      if (errorMsg?.includes("invalid") || errorMsg?.includes("incorrect")) {
        errorMessage("Invalid OTP. Please check and try again.");
      } else if (errorMsg?.includes("expired")) {
        errorMessage("OTP has expired. Please request a new one.");
      } else {
        errorMessage(errorMsg ?? "Failed to verify phone OTP");
      }
    }
    if (phoneOtpError) {
      errorMessage(
        "Failed to verify phone OTP. Please check your internet connection and try again."
      );
    }
  }, [phoneOtpResponse, phoneOtpError]);

  useEffect(() => {
    if (registerData?.statusCode < 400 && !registerError) {
      successMessage("Your account has been created successfully.");
      onSelect("login");
    }
    if (registerData?.statusCode >= 400) {
      const errorMsg = registerData?.error?.detailMessage || registerData?.data;
      if (
        errorMsg?.includes("already exists") ||
        errorMsg?.includes("already registered")
      ) {
        errorMessage(
          "An account with this email or phone number already exists. Please try logging in."
        );
      } else if (errorMsg?.includes("validation")) {
        errorMessage("Please check your information and try again.");
      } else {
        errorMessage(errorMsg ?? "Failed to create account. Please try again.");
      }
    }
    if (registerError) {
      errorMessage(
        "Failed to create account. Please check your internet connection and try again."
      );
    }
  }, [registerData, registerError, onSelect]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.form} id={styles.signup}>
      <h6>Create Your Account</h6>
      <div className="col-12 mb-3">
        <small>
          Already have an account??&nbsp;&nbsp;
          <Link role="button" to="#" onClick={() => onSelect("login")}>
            Login
          </Link>
        </small>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row mt-2">
          {/* Email Section - Full Width */}
          <div className="col-12 mb-3 position-relative ">
            <label htmlFor="email">
              {emailOtpSent ? "Email OTP" : "Email"}
              <span className="required">*</span>
            </label>
            {!emailOtpSent && !emailVerified ? (
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="email"
                  placeholder="Enter email"
                  autoComplete="off"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="flex-grow-1"
                />
                {/* <button
                  type="button"
                  className={"w-50 " + styles.loginbutton}
                  onClick={handleSendEmailOtp}
                  disabled={!formData.email || sendEmailOtpLoading}
                >
                  {sendEmailOtpLoading ? "Sending..." : "Send OTP"}
                </button> */}
              </div>
            ) : emailOtpSent && !emailVerified ? (
              <div>
                <div className="d-flex gap-2 align-items-center mb-2">
                  <input
                    type="text"
                    placeholder="Enter email OTP"
                    autoComplete="off"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="flex-grow-1"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    className={"w-50 " + styles.loginbutton}
                    onClick={handleVerifyEmailOtp}
                    disabled={!emailOtp || emailOtpLoading}
                  >
                    {emailOtpLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendEmailOtp}
                  disabled={emailOtpDisabled || sendEmailOtpLoading}
                  className={styles.resend}
                  style={{
                    cursor: emailOtpDisabled ? "not-allowed" : "pointer",
                    opacity: emailOtpDisabled ? 0.6 : 1,
                  }}
                >
                  {sendEmailOtpLoading
                    ? "Sending..."
                    : emailTimer > 0
                    ? `Resend OTP (${formatTime(emailTimer)})`
                    : "Resend OTP"}
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="flex-grow-1 bg-light"
                />
                <span className="text-success">
                  <i className="bi bi-check-circle-fill"></i> Verified
                </span>
              </div>
            )}
            {errors.email && (
              <p className="w-100 text-start">
                <span className="errors">{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone Section - Full Width */}
          <div className="col-12 mb-3 position-relative">
            <label htmlFor="phoneNumber">
              {phoneOtpSent ? "Phone OTP" : "Phone Number"}
              <span className="required">*</span>
            </label>
            {!phoneOtpSent && !phoneVerified ? (
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="text"
                  placeholder="Enter phone number"
                  autoComplete="off"
                  name="phoneNumber"
                  id="phoneNumber"
                  onChange={handleChange}
                  value={formData.phoneNumber}
                  className="flex-grow-1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onWheel={(e) => e.target.blur()}
                />
                {/* <button
                  type="button"
                  className={"w-50 " + styles.loginbutton}
                  onClick={handleSendPhoneOtp}
                  disabled={!formData.phoneNumber || sendPhoneOtpLoading}
                >
                  {sendPhoneOtpLoading ? "Sending..." : "Send OTP"}
                </button> */}
              </div>
            ) : phoneOtpSent && !phoneVerified ? (
              <div>
                <div className="d-flex gap-2 align-items-center mb-2">
                  <input
                    type="text"
                    placeholder="Enter phone OTP"
                    autoComplete="off"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                    className="flex-grow-1"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    className={"w-50 " + styles.loginbutton}
                    onClick={handleVerifyPhoneOtp}
                    disabled={!phoneOtp || phoneOtpLoading}
                  >
                    {phoneOtpLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendPhoneOtp}
                  disabled={phoneOtpDisabled || sendPhoneOtpLoading}
                  className={styles.resend}
                  style={{
                    cursor: phoneOtpDisabled ? "not-allowed" : "pointer",
                    opacity: phoneOtpDisabled ? 0.6 : 1,
                  }}
                >
                  {sendPhoneOtpLoading
                    ? "Sending..."
                    : phoneTimer > 0
                    ? `Resend OTP (${formatTime(phoneTimer)})`
                    : "Resend OTP"}
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="text"
                  value={formData.phoneNumber}
                  disabled
                  className="flex-grow-1 bg-light"
                />
                <span className="text-success">
                  <i className="bi bi-check-circle-fill"></i> Verified
                </span>
              </div>
            )}
            {errors.phoneNumber && (
              <p className="w-100 text-start">
                <span className="errors">{errors.phoneNumber}</span>
              </p>
            )}
          </div>

          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              autoComplete="off"
              name="firstName"
              id="firstName"
              onChange={handleChange}
              value={formData.firstName}
            />
            {errors.firstName && (
              <span className="errors">{errors.firstName}</span>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              autoComplete="off"
              name="lastName"
              id="lastName"
              onChange={handleChange}
              value={formData.lastName}
            />
            {errors.lastName && (
              <span className="errors">{errors.lastName}</span>
            )}
          </div>

          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="organisationType">
              Organisation Type <span className="required">*</span>
            </label>
            <select
              name="organisationType"
              id="organisationType"
              onChange={handleChange}
              defaultValue=""
            >
              <option value="" disabled>
                --Select Organisation type--
              </option>
              <option value="Individual/Freelance">Individual/Freelance</option>
              <option value="Sole Proprietership">Sole Proprietership</option>
              <option value="Partnership">Partnership</option>
              <option value="Public/Private Limited Company">
                Public/Private Limited Company
              </option>
              <option value="Trust/NGO/Societies">Trust/NGO/Societies</option>
              <option value="LLP">LLP</option>
            </select>
            {errors.organisationType && (
              <span className="errors">{errors.organisationType}</span>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="businessName">
              Business Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter business name"
              autoComplete="off"
              name="businessName"
              id="businessName"
              onChange={handleChange}
              value={formData.businessName}
            />
            {errors.businessName && (
              <span className="errors">{errors.businessName}</span>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="industryCategory">
              Industry Category <span className="required">*</span>
            </label>
            <select
              name="industryCategory"
              id="industryCategory"
              defaultValue=""
              onChange={handleChange}
            >
              <option value="" disabled>
                --Select industry category--
              </option>
              {staticData.map((item) => (
                <option value={item.name} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.industryCategory && (
              <span className="errors">{errors.industryCategory}</span>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="industrySubCategory">
              Industry Sub-category <span className="required">*</span>
            </label>
            <select
              name="industrySubCategory"
              id="industrySubCategory"
              defaultValue=""
              onChange={handleChange}
            >
              <option value="" disabled>
                --Select industry sub category--
              </option>
              {industrySubCategory.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.industrySubCategory && (
              <span className="errors">{errors.industrySubCategory}</span>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-3 position-relative">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              id="password"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <span className="errors">{errors.password}</span>
            )}
            <PasswordStrengthIndicator
              password={formData.password}
              showRequirements={false}
            />
          </div>
          <div className="col-md-6 col-sm-12 mb-4 position-relative">
            <label htmlFor="confirmpassword">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              autoComplete="off"
              name="confirmpassword"
              id="confirmpassword"
              onChange={handleConfirmPassword}
            />
            {confirmPasswordError && (
              <span className="errors">Password does not match</span>
            )}
          </div>

          <div className="col-12 mb-4">
            <button
              type="submit"
              className={styles.loginbutton}
              disabled={
                // !emailVerified || !phoneVerified ||
                registerLoading
              }
            >
              {registerLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </div>
          <div className="col-12 text-center">
            <small>
              By signing up, you agree to our&nbsp;
              <Link to="/terms-and-conditions">
                Terms & Conditions
              </Link> and <Link to="/privacy-policy">Privacy Policy</Link>
            </small>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
