import { useState } from "react";
import styles from "../../styles/loginWithUsernameAndPassword/LoginWithUsernameAndPassword.module.css";
import LoginForm from "./components/LoginForm";
import OtpForm from "./components/OtpForm";
import ForgetPassword from "./components/ForgetPassword";
import SignupForm from "./components/SignupForm";
import logo from "../../assets/logo.jpg";
const LoginWithUsernameAndPassword = () => {
  const [formType, setFormType] = useState("login");
  return (
    <div className={styles.wrapper}>
      <div className="container d-flex justify-content-center">
        <div className="row" id={styles.logincard}>
          <div
            className="col-xl-6 col-md-12 col-sm-12 p-0 d-flex flex-column justify-content-center align-item-center  px-5"
            id={styles.wrap}
          >
            <img src={logo} alt="" className={styles.logo} />
            <h1>Hello</h1>
            <h2>Welcome!</h2>
            <p>
              Seamless Payments Across Borders <br />
              Welcome to seamless global payments – your journey starts here.
            </p>
          </div>
          <div
            className="col-xl-6 col-md-12 col-sm-12 d-flex align-items-center justify-content-center "
            id={styles.form}
          >
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

export default LoginWithUsernameAndPassword;
