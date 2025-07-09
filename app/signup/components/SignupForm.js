"use client";

import { addMerchant } from "@/app/formBuilder/merchant";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SignupForm.module.css";
import { validate } from "@/app/validations/forms/AddMerchantFormValidation";
import { successMsg } from "@/app/services/notify";
import Dropdown from "@/app/ui/dropdown/Dropdown";
import { industryData } from "@/app/home/user-management/merchants/components/Columns";
import useOtpVerification from "@/app/hooks/useOtpVerification";

const SignupForm = () => {
  const { postData, loading, error, response } = usePostRequest(
    endPoints.auth.signup
  );
  const router = useRouter();
  // form json state data
  const [formData, setFormData] = useState(addMerchant);
  // State to handle errors on form submission
  const [errors, setErrors] = useState({});
  const [selectedIndustry, setSelectedIndustry] = useState({
    id: "",
    name: "Select Industry",
  });
  const [subIndusry, setSubIndustry] = useState();
  const [selectedSubIndustry, setSelectedSubIndustry] = useState({
    id: "",
    name: "Select Sub Industry",
  });

  const [showOtherBusinessType, setShowOtherBusinessType] = useState(false);
  const [showOtherSubBusinessType, setShowOtherSubBusinessType] = useState(false);

  // OTP verification hook
  const {
    emailOtpSent,
    phoneOtpSent,
    emailVerified,
    phoneVerified,
    emailOtp,
    phoneOtp,
    emailResendTimer,
    phoneResendTimer,
    sendingEmailOtp,
    verifyingEmailOtp,
    sendingPhoneOtp,
    verifyingPhoneOtp,
    setEmailOtp,
    setPhoneOtp,
    handleSendEmailOtp,
    handleSendPhoneOtp,
    handleVerifyEmailOtp,
    handleVerifyPhoneOtp,
    resetEmailVerification,
    resetPhoneVerification
  } = useOtpVerification();


  // handle input change
  const handleIndustryChange = (id, name, index) => {
    setSelectedIndustry({ id, name });
    if(name === "Other") {
      setShowOtherBusinessType(true);
      setFormData((prev) => ({ ...prev, businessType: "" }));
    }
    else {
      setShowOtherBusinessType(false);
      setFormData((prev) => ({ ...prev, businessType: name }));
    }
    setSubIndustry(industryData[index].sub);
  };

  // handle input change
  const handleSubIndustryChange = (id, name) => {
    setSelectedSubIndustry({ id, name });
    if(name === "Other") {
      setShowOtherSubBusinessType(true);
      setFormData((prev) => ({ ...prev, businessSubType: "" }));
    }
    else {
      setShowOtherSubBusinessType(false);
      setFormData((prev) => ({ ...prev, businessSubType: name }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
    
    // Reset verification if email or phone changes
    if (name === 'userId' && emailVerified) {
      resetEmailVerification();
    }
    if (name === 'contactNumber' && phoneVerified) {
      resetPhoneVerification();
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    // Check if email and phone are verified
    if (!emailVerified) {
      setErrors({ ...errors, userId: 'Please verify your email address' });
      return;
    }
    
    if (!phoneVerified) {
      setErrors({ ...errors, contactNumber: 'Please verify your phone number' });
      return;
    }
    
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  }
  useEffect(() => {
    if (response && !error) {
      successMsg(response.message);
      setFormData(addMerchant);
      router.push("/login");
    }
  }, [response, error]);
  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <div className={styles.signup}>
          <h1 className={styles.formTitle}>Merchant Registration</h1>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="name"
                    placeholder="Enter your full name"
                    className={styles.formInput}
                    onChange={handleChange}
                    value={formData.fullName}
                    autoComplete="off"
                  />
                  {errors.fullName && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.fullName}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="username" className={styles.formLabel}>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className={styles.inputWithVerification}>
                    <input
                      type="email"
                      name="userId"
                      id="username"
                      placeholder="Enter your email address"
                      className={styles.formInput}
                      value={formData.userId}
                      onChange={handleChange}
                      autoComplete="off"
                      disabled={emailVerified}
                    />
                    {emailVerified && (
                      <span className={styles.verificationStatus}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  {!emailVerified && formData.userId && !emailOtpSent && (
                    <div className={styles.otpContainer}>
                      <button
                        type="button"
                        className={styles.sendOtpButton}
                        onClick={() => handleSendEmailOtp(formData.userId)}
                        disabled={sendingEmailOtp || !formData.userId}
                      >
                        {sendingEmailOtp ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  )}
                  
                  {emailOtpSent && !emailVerified && (
                    <div className={styles.otpContainer}>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className={styles.otpInput}
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        maxLength={6}
                      />
                      <button
                        type="button"
                        className={styles.verifyButton}
                        onClick={() => handleVerifyEmailOtp(formData.userId)}
                        disabled={verifyingEmailOtp || !emailOtp}
                      >
                        {verifyingEmailOtp ? 'Verifying...' : 'Verify'}
                      </button>
                      {emailResendTimer === 0 ? (
                        <button
                          type="button"
                          className={styles.sendOtpButton}
                          onClick={() => handleSendEmailOtp(formData.userId)}
                          disabled={sendingEmailOtp}
                          style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                        >
                          Resend
                        </button>
                      ) : (
                        <span className={styles.resendTimer}>
                          Resend in {emailResendTimer}s
                        </span>
                      )}
                    </div>
                  )}
                  
                  {emailVerified && (
                    <div className={styles.verifiedBadge}>
                      <span>✓</span>
                      <span>Email verified successfully</span>
                    </div>
                  )}
                  
                  {errors.userId && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.userId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="businessname" className={styles.formLabel}>
                    Business Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    id="businessname"
                    placeholder="Enter your business name"
                    className={styles.formInput}
                    onChange={handleChange}
                    value={formData.businessName}
                    autoComplete="off"
                  />
                  {errors.businessName && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.businessName}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="phonenumber" className={styles.formLabel}>
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <div className={styles.inputWithVerification}>
                    <input
                      type="tel"
                      name="contactNumber"
                      id="phonenumber"
                      placeholder="Enter your phone number"
                      className={styles.formInput}
                      value={formData.contactNumber}
                      onChange={handleChange}
                      autoComplete="off"
                      disabled={phoneVerified}
                    />
                    {phoneVerified && (
                      <span className={styles.verificationStatus}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  
                  {!phoneVerified && formData.contactNumber && !phoneOtpSent && (
                    <div className={styles.otpContainer}>
                      <button
                        type="button"
                        className={styles.sendOtpButton}
                        onClick={() => handleSendPhoneOtp("91", formData.contactNumber)}
                        disabled={sendingPhoneOtp || !formData.contactNumber}
                      >
                        {sendingPhoneOtp ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  )}
                  
                  {phoneOtpSent && !phoneVerified && (
                    <div className={styles.otpContainer}>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className={styles.otpInput}
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        maxLength={6}
                      />
                      <button
                        type="button"
                        className={styles.verifyButton}
                        onClick={() => handleVerifyPhoneOtp("91", formData.contactNumber)}
                        disabled={verifyingPhoneOtp || !phoneOtp}
                      >
                        {verifyingPhoneOtp ? 'Verifying...' : 'Verify'}
                      </button>
                      {phoneResendTimer === 0 ? (
                        <button
                          type="button"
                          className={styles.sendOtpButton}
                          onClick={() => handleSendPhoneOtp("91", formData.contactNumber)}
                          disabled={sendingPhoneOtp}
                          style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                        >
                          Resend
                        </button>
                      ) : (
                        <span className={styles.resendTimer}>
                          Resend in {phoneResendTimer}s
                        </span>
                      )}
                    </div>
                  )}
                  
                  {phoneVerified && (
                    <div className={styles.verifiedBadge}>
                      <span>✓</span>
                      <span>Phone number verified successfully</span>
                    </div>
                  )}
                  
                  {errors.contactNumber && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.contactNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="industry" className={styles.formLabel}>
                    Industry Type <span className="text-danger">*</span>
                  </label>
                  <div className={styles.dropdownContainer}>
                    <Dropdown
                      initialLabel="Select Industry"
                      selectedValue={selectedIndustry}
                      options={industryData}
                      onChange={handleIndustryChange}
                      id="id"
                      value="name"
                    />
                  </div>
                  {errors.businessType && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.businessType}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="subindustry" className={styles.formLabel}>
                    Sub Industry <span className="text-danger">*</span>
                  </label>
                  <div className={styles.dropdownContainer}>
                    <Dropdown
                      initialLabel="Select Sub Industry"
                      selectedValue={selectedSubIndustry}
                      options={subIndusry}
                      onChange={handleSubIndustryChange}
                      id="id"
                      value="name"
                    />
                  </div>
                  {errors.businessSubType && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.businessSubType}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showOtherBusinessType && (
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className={styles.formGroup}>
                    <label htmlFor="businessType" className={styles.formLabel}>
                      Business Type <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessType"
                      id="businessType"
                      placeholder="Enter your business type"
                      className={styles.formInput}
                      value={formData.businessType}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            )}

            {showOtherSubBusinessType && (
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className={styles.formGroup}>
                    <label htmlFor="businessSubType" className={styles.formLabel}>
                      Business Sub Type <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessSubType"
                      id="businessSubType"
                      placeholder="Enter your business sub type"
                      className={styles.formInput}
                      value={formData.businessSubType}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="pan" className={styles.formLabel}>
                    PAN/SSN <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="panSsn"
                    id="pan"
                    placeholder="Enter PAN/SSN number"
                    className={styles.formInput}
                    value={formData.panSsn}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {errors.panSsn && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.panSsn}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="gst" className={styles.formLabel}>
                    GST/VAT <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstVat"
                    id="gst"
                    placeholder="Enter GST/VAT number"
                    className={styles.formInput}
                    value={formData.gstVat}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {errors.gstVat && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.gstVat}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="website" className={styles.formLabel}>
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    placeholder="https://www.example.com"
                    className={styles.formInput}
                    value={formData.website}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {errors.website && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.website}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6 col-sm-12">
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.formLabel}>
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Create a strong password"
                    className={styles.formInput}
                    autoComplete="off"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <div className={styles.errorMessage}>
                      <span>*</span>
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !emailVerified || !phoneVerified}
              title={!emailVerified || !phoneVerified ? 'Please verify your email and phone number' : ''}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {(!emailVerified || !phoneVerified) && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '0.5rem', 
                color: '#6b7280', 
                fontSize: '0.875rem' 
              }}>
                Please verify your email and phone number to continue
              </div>
            )}

            <div className={styles.loginLink}>
              <p className="m-0">Already have an account? <a href="/login">Sign in here</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
