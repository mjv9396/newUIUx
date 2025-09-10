import { useState, useEffect, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import "./NotificationIcon.css";
import { endpoints } from "../../services/apiEndpoints";

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
    // Fetch user profile data for debugging (remove merchant check temporarily)
    console.log("Fetching user profile...");
    getUserProfile(endpoints.user.fullProfile);
  }, []);

  useEffect(() => {
    console.log("User profile data received:", userProfile);
    if (userProfile?.data?.otpGeneratedTime) {
      console.log("otpGeneratedTime:", userProfile.data.otpGeneratedTime);
      const notifications = generateNotifications(
        userProfile.data.otpGeneratedTime
      );
      console.log("Generated notifications:", notifications);
      setNotifications(notifications);
    } else {
      console.log("No otpGeneratedTime data found in profile");
      setNotifications([]); // Clear notifications if no data
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
    console.log("generateNotifications called with:", otpGeneratedTime);

    if (!Array.isArray(otpGeneratedTime) || otpGeneratedTime.length < 6) {
      console.log("Invalid otpGeneratedTime format");
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

    // Calculate KYC due date (monthly renewal from the original date)
    let kycDueDate = new Date(otpDate);
    kycDueDate.setMonth(kycDueDate.getMonth() + 1);

    // Keep adding months until we get a future date
    let attempts = 0;
    // eslint-disable-next-line no-unmodified-loop-condition
    while (kycDueDate <= today && attempts < 24) {
      // Max 24 months to prevent infinite loop
      kycDueDate.setMonth(kycDueDate.getMonth() + 1);
      attempts++;
    }

    const kycDaysLeft = Math.ceil((kycDueDate - today) / (1000 * 60 * 60 * 24));

    // Calculate password expiry (keep adding 90 days until we get future date)
    let passwordExpiryDate = new Date(otpDate);
    passwordExpiryDate.setDate(passwordExpiryDate.getDate() + 90);

    // Keep adding 90 days until we get a future date
    let passwordAttempts = 0;
    // eslint-disable-next-line no-unmodified-loop-condition
    while (passwordExpiryDate <= today && passwordAttempts < 50) {
      // Max attempts to prevent infinite loop
      passwordExpiryDate.setDate(passwordExpiryDate.getDate() + 90);
      passwordAttempts++;
    }

    const passwordDaysLeft = Math.ceil(
      (passwordExpiryDate - today) / (1000 * 60 * 60 * 24)
    );

    console.log("Date calculations:", {
      otpDate: otpDate.toISOString(),
      kycDueDate: kycDueDate.toISOString(),
      passwordExpiryDate: passwordExpiryDate.toISOString(),
      kycDaysLeft,
      passwordDaysLeft,
    });

    // ALWAYS add KYC notification (regardless of days left)
    console.log("Adding KYC notification - days left:", kycDaysLeft);
    notifications.push({
      id: "kyc-renewal",
      type: "kyc",
      title: "KYC Renewal Due",
      message: `Your KYC verification expires in ${kycDaysLeft} days. Please renew to avoid service interruption.`,
      priority: kycDaysLeft <= 30 ? "high" : "medium",
      icon: "bi bi-shield-check",
      daysLeft: kycDaysLeft,
    });

    // ALWAYS add password expiry notification (regardless of days left)
    console.log(
      "Adding password expiry notification - days left:",
      passwordDaysLeft
    );
    notifications.push({
      id: "password-expiry",
      type: "password",
      title: "Password Expiring Soon",
      message: `Your password expires in ${passwordDaysLeft} days. Please update your password for continued access.`,
      priority: passwordDaysLeft <= 30 ? "high" : "medium",
      icon: "bi bi-key",
      daysLeft: passwordDaysLeft,
    });

    // Always add a test notification to ensure we can see multiple notifications
    notifications.push({
      id: "system-info",
      type: "info",
      title: "System Information",
      message: `Profile last updated: ${otpDate.toLocaleDateString()}. KYC due in ${kycDaysLeft} days, Password expires in ${passwordDaysLeft} days.`,
      priority: "low",
      icon: "bi bi-info-circle",
      daysLeft: 0,
    });

    const sortedNotifications = [...notifications].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    console.log("Final notifications to return:", sortedNotifications);
    return sortedNotifications;
  };

  // Debug: Check user role
  console.log(
    "User role check:",
    isMerchant(),
    localStorage.getItem("userRole")
  );

  // Temporarily show for all users for testing
  // if (!isMerchant()) {
  //   return null;
  // }

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
