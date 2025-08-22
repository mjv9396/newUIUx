import { useState, useEffect } from "react";
import styles from "../../styles/login/Login.module.css";
import LoginForm from "./components/LoginForm";
import OtpForm from "./components/OtpForm";
import ForgetPassword from "./components/ForgetPassword";
import SignupForm from "./components/SignupForm";
import logo from "../../assets/logo.png";

const Login = () => {
  const [formType, setFormType] = useState("login");
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    "/carousel.png",
    // "https://panel.atmoondps.com/static/images/carousel/atmoon/carousel1.png",
    // "https://panel.atmoondps.com/static/images/carousel/atmoon/carousel3.png",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.loginContainer} container-fluid overflow-hidden`}>
      <div className="row min-vh-100">
        {/* Left Side - Login Form */}
        <div className={`col-lg-5 col-md-6 ${styles.loginSection}`}>
          <div className={styles.loginCard}>
            <div className={styles.logoSection}>
              <img src={logo} alt="Company Logo" className={styles.logo} />
            </div>

            <div className={styles.welcomeText}>
              <h2>
                Welcome to{" "}
                <span className={styles.brandName}>
                  Seamless Payment Solutions
                </span>
              </h2>
              <p>
                Seamless Payments Across Borders - Your journey starts here.
              </p>
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

        {/* Right Side - Image Carousel */}
        <div className={`col-lg-7 col-md-6 ${styles.carouselSection}`}>
          <div className={styles.carouselContainer}>
            {/* <div className={styles.carouselWrapper}> */}
              {/* <div className={styles.imageContainer}> */}
                <img
                  src={carouselImages[currentSlide]}
                  alt={`Slide ${currentSlide + 1}`}
                  className={styles.carouselImage}
                />
                
              {/* </div> */}

              {/* Carousel Controls */}
              

              {/* Carousel Indicators */}
              {/* <div className={styles.carouselIndicators}>
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.indicator} ${
                      currentSlide === index ? styles.active : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
