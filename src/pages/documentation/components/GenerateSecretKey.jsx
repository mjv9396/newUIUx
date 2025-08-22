/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styles from "../../../styles/login/Form.module.css";
import usePost from "../../../hooks/usePost";
import { successMessage, errorMessage } from "../../../utils/messges";
import { endpoints } from "../../../services/apiEndpoints";

const GenerateSecretKey = ({ onClose, onSuccess, userEmail }) => {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Send OTP API (FormData, pass true)
  const {
    postData: sendOtp,
    data: otpData,
    error: otpError,
    loading: otpLoading,
  } = usePost(endpoints.sendOtp, true);

  // Verify Secret OTP API (JSON)
  const {
    postData: verifySecretOtp,
    data: verifyData,
    error: verifyError,
    loading: verifyLoading,
  } = usePost(endpoints.verifySecretOtp);

  // Automatically send OTP when component mounts
  useEffect(() => {
    if (userEmail && !otpSent) {
      const formData = new FormData();
      formData.append("email", userEmail);
      sendOtp(formData);
      setOtpSent(true);
    }
  }, [userEmail, otpSent]);

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpSent, timeLeft]);

  // Format time display (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Reset timer when OTP is sent
  const resetTimer = () => {
    setTimeLeft(300); // 5 minutes
    setCanResend(false);
  };

  // Handle send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData();
    formData.append("email", userEmail);
    await sendOtp(formData);
    resetTimer(); // Reset timer when resending OTP
  };

  // Handle verify OTP and generate new secret key
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    await verifySecretOtp({ email: userEmail, otp });
  };

  // Step change on OTP send
  useEffect(() => {
    if (otpData?.statusCode < 400 && !otpError) {
      successMessage(otpData?.data || "OTP sent to your email");
      resetTimer(); // Reset timer on successful OTP send
    }
    if (otpData?.statusCode >= 400 || otpError) {
      errorMessage(otpData?.error?.detailMessage || "Failed to send OTP");
    }
  }, [otpData, otpError]);

  // On secret key generation success
  useEffect(() => {
    if (verifyData?.statusCode < 400) {
      successMessage(
        verifyData?.data || "New secret key generated successfully"
      );
      setOtp("");
      onSuccess(); // Callback to refresh profile data
      onClose(); // Close the modal/component
    }
    if (verifyData?.statusCode >= 400) {
      errorMessage(
        verifyData?.error?.detailMessage || "Failed to generate new secret key"
      );
    }
  }, [verifyData, verifyError, onClose, onSuccess]);

  return (
    <div style={{ width: "100%", padding: "4px" }} className={styles.form}>
      <div className="d-flex w-100 justify-content-between align-items-center mb-3">
        <h6>Generate New Secret Key</h6>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="col-12">
        <small>
          Enter the OTP sent to your email ({userEmail}) to generate a new
          secret key.
        </small>
        <div className="mt-2">
          <small
            className={`text-${
              timeLeft > 60 ? "success" : timeLeft > 30 ? "warning" : "danger"
            }`}
          >
            {timeLeft > 0 ? (
              <>
                OTP expires in: <strong>{formatTime(timeLeft)}</strong>
              </>
            ) : (
              <span className="text-danger">
                OTP has expired. Please request a new one.
              </span>
            )}
          </small>
        </div>
      </div>
      <div className="row mt-3">
        <form onSubmit={handleVerifyOtp}>
          <div className="col-12 mb-4 position-relative">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              autoComplete="off"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors.otp && <span className="errors">{errors.otp}</span>}
          </div>
          <div className="col-12 mb-4">
            <button
              type="submit"
              className={styles.loginbutton}
              disabled={verifyLoading || timeLeft === 0}
            >
              {verifyLoading ? "Generating..." : "Generate New Secret Key"}
            </button>
            {timeLeft === 0 && (
              <small className="text-danger d-block mt-1">
                OTP has expired. Please request a new OTP.
              </small>
            )}
          </div>
          <div className="col-12 d-flex justify-content-between">
            <button
              type="button"
              className={`btn btn-link p-0 ${!canResend ? "text-muted" : ""}`}
              onClick={handleSendOtp}
              disabled={otpLoading || !canResend}
              title={
                !canResend
                  ? `Wait ${formatTime(timeLeft)} to resend`
                  : "Resend OTP"
              }
            >
              {otpLoading
                ? "Sending..."
                : canResend
                ? "Resend OTP"
                : `Resend OTP (${formatTime(timeLeft)})`}
            </button>
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateSecretKey;
