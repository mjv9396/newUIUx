// pages/login.js
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';
import usePost from '@/app/hooks/usePost';
import { login, loginFail } from '@/app/utils/message';
import { endPoints } from '@/app/services/apiEndpoints';
import { validate } from '@/app/validations/forms/LoginFormValidations';
import { generateToken } from '@/app/formBuilder/auth';
import { saveAuthToken } from '@/app/services/cookieManager';
import { errorMsg, successMsg } from '@/app/services/notify';

const Login = () => {
  const { postData, loading, error, response } = usePost(endPoints.auth.login);
  const router = useRouter();
  const canvasRef = useRef(null);
  
  // form json state data
  const [formData, setFormData] = useState(generateToken);
  
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [captchaValue, setCaptchaValue] = useState('');
  
  // Add state for captcha
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');

  const carouselImages = [
    'https://panel.atmoondps.com/static/images/carousel/atmoon/carousel1.png',
    'https://panel.atmoondps.com/static/images/carousel/atmoon/carousel2.png',
    'https://panel.atmoondps.com/static/images/carousel/atmoon/carousel3.png',
  ];

  // Generate random captcha code
  const generateCaptchaCode = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate captcha image
  const generateCaptchaImage = (code) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 150;
    canvas.height = 50;
    
    // Background with noise
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Draw text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw each character with random color and slight rotation
    for (let i = 0; i < code.length; i++) {
      ctx.save();
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
      ctx.translate(25 + (i * 20), 25);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }
    
    return canvas.toDataURL();
  };

  // Initialize captcha
  const initializeCaptcha = () => {
    const code = generateCaptchaCode();
    setCaptchaCode(code);
    setCaptchaImage(generateCaptchaImage(code));
    setCaptchaValue('');
    setErrors(prev => ({ ...prev, captcha: '' }));
  };

  // Initialize captcha on component mount
  useEffect(() => {
    initializeCaptcha();
  }, []);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({});
  };

  const handleCaptchaChange = (e) => {
    setCaptchaValue(e.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    // Validate captcha (case-sensitive exact match)
    if (captchaValue !== captchaCode) {
      setErrors({ captcha: 'Please enter the correct captcha code (case-sensitive)' });
      return;
    }
    
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    await postData(formData);
  }

  useEffect(() => {
    if (response?.data && !error) {
      if (response.status === "fail") {
        errorMsg(loginFail);
      } else {
        const setCookie = saveAuthToken(
          response.data.token,
          response.data.userRole,
          response.data.email,
          response.data.fullName
        );
        if (setCookie) {
          router.push("/home");
          successMsg(login);
        }
      }
    }
  }, [response, error]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const refreshCaptcha = () => {
    initializeCaptcha();
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.loginContainer} container-fluid`}>
      <div className="row min-vh-100">
        {/* Left Side - Login Form */}
        <div className={`col-lg-5 col-md-6 ${styles.loginSection}`}>
          <div className={styles.loginCard}>
            <div className={styles.logoSection}>
              <Image
                src="/logo.png"
                alt="AtMoon Digital Payment Solutions"
                width={200}
                height={60}
                className={styles.logo}
              />
            </div>
            
            <div className={styles.welcomeText}>
              <h2>Welcome to <span className={styles.brandName}>At Moon Ventures Admin Panel</span></h2>
            </div>

            <div className={styles.formHeader}>
              <h3>Enter Email & Password to continue</h3>
            </div>

            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={`mb-3 ${styles.inputGroup}`}>
                <label htmlFor="userName" className="form-label">Email Id*</label>
                <input
                  type="text"
                  className={`form-control ${styles.formInput}`}
                  id="userName"
                  name="userName"
                  placeholder="Enter Email/Username"
                  value={formData.userName || ''}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <small className="text-danger">
                    <span className="text-danger">*</span> {errors.email}
                  </small>
                )}
              </div>

              <div className={`mb-3 ${styles.inputGroup}`}>
                <label htmlFor="password" className="form-label">Password*</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${styles.formInput}`}
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <small className="text-danger">
                    <span className="text-danger">*</span> {errors.password}
                  </small>
                )}
              </div>

              <div className={`mb-4 ${styles.captchaSection}`}>
                <label className="form-label">Captcha*</label>
                <div className={styles.captchaBox}>
                  <div className={styles.captchaImageContainer}>
                    <img 
                      src={captchaImage} 
                      alt="Captcha" 
                      className={styles.captchaImage}
                    />
                  </div>
                  <input
                    type="text"
                    className={`form-control ${styles.captchaInput}`}
                    name="captcha"
                    placeholder="Enter captcha"
                    value={captchaValue}
                    onChange={handleCaptchaChange}
                    required
                  />
                  <button 
                    type="button" 
                    className={styles.refreshCaptcha} 
                    onClick={refreshCaptcha}
                    title="Refresh Captcha"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                {errors.captcha && (
                  <small className="text-danger">
                    <span className="text-danger">*</span> {errors.captcha}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className={`btn ${styles.continueBtn} w-100`}
                disabled={loading}
              >
                {loading ? "Logging In..." : "Continue"}
              </button>

              <div className={styles.registerLink}>
                <a href="/signup">New Registration</a>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image Carousel Only */}
        <div className={`col-lg-7 col-md-6 ${styles.carouselSection}`}>
          <div className={styles.carouselContainer}>
            <div className={styles.carouselWrapper}>
              <div className={styles.imageContainer}>
                <Image
                  src={carouselImages[currentSlide]}
                  alt={`Slide ${currentSlide + 1}`}
                  width={1024}
                  height={600}
                  className={styles.carouselImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;