import { useState } from 'react';
import usePost from './usePost';
import { endPoints } from '@/app/services/apiEndpoints';
import { errorMsg, successMsg } from '@/app/services/notify';

const useOtpVerification = () => {
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailResendTimer, setEmailResendTimer] = useState(0);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);

  // Hook instances for different endpoints
  const { postData: sendEmailOtp, loading: sendingEmailOtp } = usePost(endPoints.kyc.sendEmailOtp);
  const { postData: verifyEmailOtp, loading: verifyingEmailOtp } = usePost(endPoints.kyc.verifyEmailOtp);
  const { postData: sendPhoneOtp, loading: sendingPhoneOtp } = usePost(endPoints.kyc.sendPhoneOtp);
  const { postData: verifyPhoneOtp, loading: verifyingPhoneOtp } = usePost(endPoints.kyc.verifyPhoneOtp);

  const startResendTimer = (type) => {
    const duration = 60; // 60 seconds
    
    if (type === 'email') {
      setEmailResendTimer(duration);
      const timer = setInterval(() => {
        setEmailResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (type === 'phone') {
      setPhoneResendTimer(duration);
      const timer = setInterval(() => {
        setPhoneResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleSendEmailOtp = async (email) => {
    try {
      const response = await sendEmailOtp({ email });
      if (response && !response.error) {
        setEmailOtpSent(true);
        setEmailOtp('');
        startResendTimer('email');
        successMsg('OTP sent to your email address');
      } else {
        errorMsg('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      errorMsg('Error sending OTP. Please try again.');
    }
  };

  const handleSendPhoneOtp = async (countryCode, mobileNumber) => {
    try {
      const response = await sendPhoneOtp({ 
        countryCode: countryCode || "91", 
        mobileNumber 
      });
      if (response && !response.error) {
        setPhoneOtpSent(true);
        setPhoneOtp('');
        startResendTimer('phone');
        successMsg('OTP sent to your phone number');
      } else {
        errorMsg('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      errorMsg('Error sending OTP. Please try again.');
    }
  };

  const handleVerifyEmailOtp = async (email) => {
    if (!emailOtp || emailOtp.length < 4) {
      errorMsg('Please enter a valid OTP');
      return;
    }

    try {
      const response = await verifyEmailOtp({ email, otp: emailOtp });
      if (response && !response.error) {
        setEmailVerified(true);
        setEmailOtpSent(false);
        successMsg('Email verified successfully');
      } else {
        errorMsg('Invalid OTP. Please try again.');
      }
    } catch (error) {
      errorMsg('Error verifying OTP. Please try again.');
    }
  };

  const handleVerifyPhoneOtp = async (countryCode, mobileNumber) => {
    if (!phoneOtp || phoneOtp.length < 4) {
      errorMsg('Please enter a valid OTP');
      return;
    }

    try {
      const response = await verifyPhoneOtp({ 
        countryCode: countryCode || "91", 
        mobileNumber, 
        otp: phoneOtp 
      });
      if (response && !response.error) {
        setPhoneVerified(true);
        setPhoneOtpSent(false);
        successMsg('Phone number verified successfully');
      } else {
        errorMsg('Invalid OTP. Please try again.');
      }
    } catch (error) {
      errorMsg('Error verifying OTP. Please try again.');
    }
  };

  return {
    // States
    emailOtpSent,
    phoneOtpSent,
    emailVerified,
    phoneVerified,
    emailOtp,
    phoneOtp,
    emailResendTimer,
    phoneResendTimer,
    
    // Loading states
    sendingEmailOtp,
    verifyingEmailOtp,
    sendingPhoneOtp,
    verifyingPhoneOtp,
    
    // Setters
    setEmailOtp,
    setPhoneOtp,
    
    // Actions
    handleSendEmailOtp,
    handleSendPhoneOtp,
    handleVerifyEmailOtp,
    handleVerifyPhoneOtp,
    
    // Reset functions
    resetEmailVerification: () => {
      setEmailOtpSent(false);
      setEmailVerified(false);
      setEmailOtp('');
      setEmailResendTimer(0);
    },
    resetPhoneVerification: () => {
      setPhoneOtpSent(false);
      setPhoneVerified(false);
      setPhoneOtp('');
      setPhoneResendTimer(0);
    }
  };
};

export default useOtpVerification;
