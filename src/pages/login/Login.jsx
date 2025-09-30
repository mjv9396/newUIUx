import { useState } from "react";
import styles from "../../styles/login/Login.module.css";
import LoginForm from "./components/LoginForm";
import OtpForm from "./components/OtpForm";
import ForgetPassword from "./components/ForgetPassword";
import SignupForm from "./components/SignupForm";
import logo from "../../assets/logo.png";

const Login = () => {
  const [formType, setFormType] = useState("login");

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.decorativeElements}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.logoSection}>
            <img src={logo} alt="Company Logo" className={styles.logo} />
          </div>

          <div className={styles.formContainer}>
            {formType === "login" && (
              <LoginForm onSelect={(type) => setFormType(type)} />
            )}
            {formType === "otp" && (
              <OtpForm onSelect={(type) => setFormType(type)} />
            )}
            {formType === "forgetpassword" && (
              <ForgetPassword onSelect={(type) => setFormType(type)} />
            )}
            {formType === "signup" && (
              <SignupForm onSelect={(type) => setFormType(type)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
