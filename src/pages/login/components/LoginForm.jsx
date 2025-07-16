/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/login/Form.module.css";
import { useEffect, useState } from "react";
import { loginForm } from "../../../forms/auth";
import { validateLoginForm } from "../../../formValidations/loginForm";
import usePost from "../../../hooks/usePost";
import { endpoints } from "../../../services/apiEndpoints";
import { CookieStorage, GetUserStatus } from "../../../services/cookieStore";
import { errorMessage, successMessage } from "../../../utils/messges";
import captchaBg from "../../../assets/captcha.png";

const LoginForm = ({ onSelect }) => {
  const router = useNavigate();
  // form handlers
  const [formData, setFormData] = useState(loginForm);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaString = "";
    const randomLengthBetween5and7 = Math.floor(Math.random() * 3) + 5; // Random length between 5 and 7
    for (let i = 0; i < randomLengthBetween5and7; i++) {
      captchaString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptcha(captchaString); // Store the generated captcha for validation
    return captchaString;
  };

  const [captchaImage, setCaptchaImage] = useState("");

  const generateCaptchaImage = () => {
    const text = generateCaptcha();
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = captchaBg; // Path to your background image

    image.onload = () => {
      // Draw the background image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw the captcha text on top
      ctx.font = "80px Arial";
      ctx.fillStyle = "#333";
      // position center
      ctx.fillText(
        text,
        canvas.width / 2 - ctx.measureText(text).width / 2,
        canvas.height / 2 + 25
      );

      // Convert to image data and set
      setCaptchaImage(canvas.toDataURL("image/png"));
    };

    image.onerror = () => {
      console.error("Failed to load background image.");
    };
  };

  useEffect(() => {
    generateCaptchaImage();
  }, []);

  const validateCaptcha = (input) => {
    return input === captcha;
  };

  // API handlers
  const { postData, data, error, loading } = usePost(endpoints.login);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateLoginForm(formData);
    if (Object.keys(validationError).length > 0) {
      setErrors(validationError);
      generateCaptchaImage();
      return;
    }
    if (!validateCaptcha(formData.captcha)) {
      errorMessage("Captcha is incorrect. Please try again.");
      generateCaptchaImage();
      return;
    }
    await postData(formData);
  };
  const checkAccountStatus = () => {
    if (GetUserStatus()) router("/dashboard");
    else router("/kyc-verification");
  };

  useEffect(() => {
    if (data && !error) {
      if (data.token) {
        const response = CookieStorage(data);
        if (response) checkAccountStatus();
        successMessage("Welcome Back! You are successfully login");
      }
      if (data === "User inactive") errorMessage("User Inactive");
    }
  }, [error, data]);

  const [captcha, setCaptcha] = useState(false);

  return (
    <div className={styles.form}>
      <h6>Access Your Account</h6>
      <div className="col-12">
        <small>Enter your email and password to access your account.</small>
      </div>

      <div className="row mt-3">
        <form onSubmit={handleSubmit}>
          <div className="col-12 mb-3 position-relative">
            <label htmlFor="username">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your registered email"
              autoComplete="off"
              name="username"
              id="username"
              onChange={handleChange}
              value={formData.username}
            />
            {errors.username && (
              <span className="errors">{errors.username}</span>
            )}
          </div>
          <div className="col-12 mb-3 position-relative">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="off"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <span className="errors">{errors.password}</span>
            )}
          </div>

          {/* Captcha Section */}
          <div className="col-12 mb-3">
            {/* <label htmlFor="captcha">
              Captcha <span className="required">*</span>
            </label> */}
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "8px" }}
            >
              <img
                src={captchaImage}
                alt="Captcha"
                style={{
                  width: "90%",
                  height: "60px",
                  objectFit: "contain",
                  cursor: "pointer",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
                onClick={generateCaptchaImage}
              />
              <button
                type="button"
                onClick={generateCaptchaImage}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "var(--primary, #667eea)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  flexShrink: 0,
                }}
                title="Refresh Captcha"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter the captcha"
              autoComplete="off"
              id="captcha"
              name="captcha"
              onChange={handleChange}
              value={formData.captcha}
              style={{ width: "100%" }}
            />
          </div>

          <div className="col-12 d-flex justify-content-end mb-3">
            <button
              type="button"
              className={styles.links}
              onClick={() => onSelect("forgetpassword")}
            >
              Forget Password?
            </button>
          </div>

          <div className="col-12 mb-4">
            <button
              type="submit"
              disabled={loading}
              className={styles.loginbutton}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>

          <div className="col-12 text-center">
            <small>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className={styles.links}
                onClick={() => onSelect("signup")}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                Sign up
              </button>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
