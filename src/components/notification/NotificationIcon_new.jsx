import { useState, useEffect, useRef } from "react";
import React, { useState, useRef, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import endpoints from "../../services/endpoints";
import "./NotificationIcon.css";

// Check if user is a merchant
const isMerchant = () => {
  const userRole = JSON.parse(localStorage.getItem("userRole") || "[]");
  return userRole.includes("MERCHANT");
};

const NotificationIcon = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const popoverRef = useRef(null);
  const iconRef = useRef(null);

  const { fetchData: getUserProfile, data: userProfile } = useFetch();

  useEffect(() => {
    // Fetch user profile data if merchant
    if (isMerchant()) {
      getUserProfile(endpoints.user.fullProfile);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.data?.otpGeneratedTime && isMerchant()) {
      const notifications = generateNotifications(
        userProfile.data.otpGeneratedTime
      );
      setNotifications(notifications);
    }
  }, [userProfile]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  const generateNotifications = (otpGeneratedTime) => {
    if (!Array.isArray(otpGeneratedTime) || otpGeneratedTime.length < 6) {
      return [];
    }

    const notifications = [];
    const today = new Date();

    // Parse otpGeneratedTime array [year, month, day, hour, minute, second]
    const otpDate = new Date(
      otpGeneratedTime[0], // year
      otpGeneratedTime[1] - 1, // month (0-indexed)
      otpGeneratedTime[2], // day
      otpGeneratedTime[3], // hour
      otpGeneratedTime[4], // minute
      otpGeneratedTime[5] // second
    );

    // Calculate KYC due date (monthly renewal)
    let kycDueDate = new Date(otpDate);
    kycDueDate.setMonth(kycDueDate.getMonth() + 1);

    // Ensure KYC date is always in the future
    while (kycDueDate <= today) {
      kycDueDate.setMonth(kycDueDate.getMonth() + 1);
    }

    const kycDaysLeft = Math.ceil((kycDueDate - today) / (1000 * 60 * 60 * 24));

    // Calculate password expiry (90 days from otpGeneratedTime)
    let passwordExpiryDate = new Date(otpDate);
    passwordExpiryDate.setDate(passwordExpiryDate.getDate() + 90);

    // Ensure password expiry is always in the future
    while (passwordExpiryDate <= today) {
      passwordExpiryDate.setDate(passwordExpiryDate.getDate() + 90);
    }

    const passwordDaysLeft = Math.ceil(
      (passwordExpiryDate - today) / (1000 * 60 * 60 * 24)
    );

    // Add KYC notification
    if (kycDaysLeft <= 30) {
      notifications.push({
        id: "kyc-renewal",
        type: "kyc",
        title: "KYC Renewal Required",
        message: `Your KYC verification expires in ${kycDaysLeft} days. Please renew to avoid service interruption.`,
        priority: kycDaysLeft <= 7 ? "high" : "medium",
        icon: "bi bi-shield-check",
        daysLeft: kycDaysLeft,
      });
    }

    // Add password expiry notification
    if (passwordDaysLeft <= 14) {
      notifications.push({
        id: "password-expiry",
        type: "password",
        title: "Password Expiring Soon",
        message: `Your password expires in ${passwordDaysLeft} days. Please update your password.`,
        priority: passwordDaysLeft <= 3 ? "high" : "medium",
        icon: "bi bi-key",
        daysLeft: passwordDaysLeft,
      });
    }

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  // Only show for merchants
  if (!isMerchant()) {
    return null;
  }

  const hasNotifications = notifications.length > 0;
  const hasHighPriorityNotifications = notifications.some(
    (n) => n.priority === "high"
  );

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  return (
    <div className="notification-container">
      <button
        ref={iconRef}
        className={`notification-icon ${
          hasHighPriorityNotifications ? "urgent" : ""
        }`}
        onClick={togglePopover}
        title="Notifications"
      >
        <i className="bi bi-bell"></i>
        {hasNotifications && (
          <span
            className={`notification-badge ${
              hasHighPriorityNotifications ? "urgent" : ""
            }`}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {showPopover && (
        <div ref={popoverRef} className="notification-popover">
          <div className="notification-header">
            <h6 className="mb-0">Notifications</h6>
            <button className="close-btn" onClick={() => setShowPopover(false)}>
              <i className="bi bi-x"></i>
            </button>
          </div>
          <div className="notification-body">
            {hasNotifications ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.priority}`}
                >
                  <div className="notification-item-icon">
                    <i className={notification.icon}></i>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <i className="bi bi-check-circle"></i>
                <p>All caught up! No new notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
